"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-content">
      <style>{`
        .prose-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 32px 0 16px;
          color: #F8FAFC;
          font-family: var(--font-heading);
          line-height: 1.3;
        }
        .prose-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 24px 0 12px;
          color: #F8FAFC;
          font-family: var(--font-heading);
          line-height: 1.35;
        }
        .prose-content p {
          margin: 0 0 16px;
          line-height: 1.75;
          color: #94A3B8;
          font-size: 1rem;
        }
        .prose-content ul, .prose-content ol {
          margin: 0 0 16px;
          padding-left: 24px;
        }
        .prose-content li {
          margin-bottom: 8px;
          color: #94A3B8;
          line-height: 1.7;
        }
        .prose-content strong {
          color: #F8FAFC;
          font-weight: 600;
        }
        .prose-content blockquote {
          border-left: 4px solid #7C3AED;
          padding: 16px 24px;
          background: var(--bg-surface);
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        .prose-content blockquote p {
          margin: 0;
          color: #94A3B8;
          font-style: italic;
        }
        .prose-content code {
          background: rgba(148, 163, 184, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
          color: #F8FAFC;
        }
        .prose-content pre {
          background: rgba(10, 18, 36, 0.8);
          color: #E2E8F0;
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 24px 0;
        }
        .prose-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
          font-size: 0.875rem;
        }
        .prose-content a {
          color: #7C3AED;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-content a:hover {
          color: #6D28D9;
        }
        .prose-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 32px 0;
        }
        .prose-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }
        .prose-content th, .prose-content td {
          border: 1px solid var(--border);
          padding: 12px 16px;
          text-align: left;
        }
        .prose-content th {
          background: var(--bg-surface);
          font-weight: 600;
          color: #F8FAFC;
        }
        .prose-content td {
          color: #94A3B8;
        }
        .prose-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
