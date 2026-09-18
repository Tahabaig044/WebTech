import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/actions/admin";
import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "Edit Blog Post — Admin" };

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        Edit Blog Post
      </h1>
      <BlogForm initial={post} mode="edit" />
    </div>
  );
}
