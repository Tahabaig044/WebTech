"use server";

import { createClient } from "@/lib/supabase/server";

export async function createNotificationForUser(params: {
  user_id: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
}) {
  try {
    const supabase = createClient();
    await supabase.from("notifications").insert({
      user_id: params.user_id,
      type: params.type,
      title: params.title,
      message: params.message || null,
      link: params.link || null,
    });
  } catch {
    // Silent fail — notifications should never block primary operations
  }
}

export async function notifyAllAdmins(params: {
  type: string;
  title: string;
  message?: string;
  link?: string;
  exclude_user_id?: string;
}) {
  try {
    const supabase = createClient();
    const { data: admins } = await supabase
      .from("users")
      .select("id")
      .in("role", ["admin", "agent"]);
    if (!admins) return;
    for (const admin of admins) {
      if (params.exclude_user_id && admin.id === params.exclude_user_id) continue;
      await createNotificationForUser({
        user_id: admin.id,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
      });
    }
  } catch {
    // Silent fail
  }
}
