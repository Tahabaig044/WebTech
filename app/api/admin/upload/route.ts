import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";
// Multipart uploads must never be served from a cache.
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const UPLOAD_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Media uploads run server-side with the service-role key. The browser client
 * only ever holds the public anon key, which deliberately has no write policy
 * on the bucket, so this endpoint is the single writer.
 *
 * Implemented as a Route Handler rather than a Server Function: passing a
 * FormData argument to a Server Function relies on Next.js replaying the
 * incoming request body, which fails with "Connection closed." on multipart
 * bodies. `request.formData()` here has no such constraint.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "agent") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const { allowed } = checkRateLimit(`upload:${ip}`);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Too many uploads. Please try again later." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid upload payload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ success: false, error: "No file selected" }, { status: 400 });
  }
  const ext = UPLOAD_MIME_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { success: false, error: "Invalid file type. Accepted: JPG, PNG, WebP, GIF" },
      { status: 400 }
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { success: false, error: "File too large. Maximum size: 5MB" },
      { status: 400 }
    );
  }

  // Strip everything except a safe path charset; this also removes "." so
  // traversal segments cannot survive.
  const folder =
    (form.get("folder") ? String(form.get("folder")) : "uploads")
      .replace(/[^a-zA-Z0-9/_-]/g, "")
      .replace(/\/{2,}/g, "/")
      .replace(/^\/+|\/+$/g, "")
      .slice(0, 64) || "uploads";

  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const supabase = createClient();
  const { error } = await supabase.storage
    .from("public")
    .upload(path, bytes, { contentType: file.type, cacheControl: "3600", upsert: false });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("public").getPublicUrl(path);
  return NextResponse.json({ success: true, url: data.publicUrl });
}
