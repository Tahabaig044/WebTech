interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length === 0) return null;

  return (
    <nav
      className="blog-toc"
      style={{
        position: "sticky",
        top: "96px",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
      }}
    >
      <style>{`
        .blog-toc-title {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
          margin-bottom: 16px;
        }
        .blog-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .blog-toc-list li {
          margin: 0;
        }
        .blog-toc-link {
          display: block;
          padding: 6px 0;
          font-size: 0.85rem;
          color: #64748B;
          text-decoration: none;
          line-height: 1.4;
          transition: color 0.2s ease;
          border-left: 2px solid transparent;
          padding-left: 12px;
        }
        .blog-toc-link:hover {
          color: #2563EB;
          border-left-color: #2563EB;
        }
        .blog-toc-link.level-3 {
          padding-left: 24px;
          font-size: 0.82rem;
        }
      `}</style>
      <p className="blog-toc-title">On This Page</p>
      <ul className="blog-toc-list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`blog-toc-link level-${heading.level}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
