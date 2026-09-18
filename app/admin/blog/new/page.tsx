import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "New Blog Post — Admin" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        New Blog Post
      </h1>
      <BlogForm mode="create" />
    </div>
  );
}
