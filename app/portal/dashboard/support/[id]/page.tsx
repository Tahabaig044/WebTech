"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPortalTicketById, getPortalTicketMessages, replyToTicket } from "@/lib/actions/portal";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import { toast } from "sonner";
import type { SupportTicket, TicketMessage } from "@/lib/types";

export default function TicketDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!session?.user?.email || !ticketId) return;

    Promise.all([
      getPortalTicketById(ticketId),
      getPortalTicketMessages(ticketId),
    ])
      .then(([ticketRes, messagesRes]) => {
        if (ticketRes.error || !ticketRes.data) {
          setError(ticketRes.error || "Ticket not found");
        } else {
          setTicket(ticketRes.data);
          setMessages(messagesRes.data || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load ticket:", err);
        setError("Failed to load ticket. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [session?.user?.email, ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || sending) return;

    setSending(true);
    const result = await replyToTicket(ticketId, { message: reply.trim() });
    setSending(false);

    if (result.success) {
      setReply("");
      toast.success("Reply sent");
      // Refetch messages
      const messagesRes = await getPortalTicketMessages(ticketId);
      setMessages(messagesRes.data || []);
    } else {
      toast.error("Failed to send reply", { description: result.error });
    }
  };

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: "28px" }}>
          <div style={{ height: "28px", width: "200px", borderRadius: "6px", background: "rgba(139,92,246,0.08)", marginBottom: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "16px", width: "300px", borderRadius: "4px", background: "rgba(139,92,246,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        <LoadingSkeleton rows={4} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div>
        <Link href="/portal/dashboard/support" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          ← Back to Support
        </Link>
        <div style={{ padding: "48px 24px", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "16px", opacity: 0.5 }}>⊘</div>
          <h3 style={{ color: "#E5E7EB", fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Ticket not found</h3>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", maxWidth: "360px", margin: "0 auto 20px", lineHeight: 1.5 }}>
            {error || "The ticket you're looking for doesn't exist or you don't have access to it."}
          </p>
          <Link href="/portal/dashboard/support" style={{ display: "inline-block", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
            View All Tickets
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(ticket.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const updatedDate = new Date(ticket.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      {/* Back link */}
      <Link href="/portal/dashboard/support" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
        ← Back to Support
      </Link>

      {/* Ticket Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ color: "#C4B5FD", fontWeight: 600, fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{ticket.ticket_number}</span>
          <StatusBadge status={ticket.status} />
          <StatusBadge status={ticket.priority} variant="priority" />
        </div>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>
          {ticket.subject}
        </h1>
        <p style={{ color: "#6B7280", fontSize: "0.82rem", margin: 0 }}>
          Created {createdDate} · Last updated {updatedDate}
        </p>
      </div>

      {/* Main Grid */}
      <div className="portal-ticket-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", marginBottom: "32px" }}>
        {/* Left Column — Conversation */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "20px" }}>Conversation</h3>

          {/* Messages */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px", maxHeight: "400px", overflowY: "auto" }}>
            {/* Original message */}
            <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>
                  {(session?.user?.name || "C").charAt(0).toUpperCase()}
                </div>
                <span style={{ color: "#E5E7EB", fontSize: "0.82rem", fontWeight: 600 }}>You</span>
                <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>{createdDate}</span>
              </div>
              <p style={{ color: "#CBD5E1", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{ticket.message}</p>
            </div>

            {/* Thread messages */}
            {messages.map((msg) => {
              const isClient = msg.sender_role === "client";
              const senderDate = new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
              return (
                <div key={msg.id} style={{
                  padding: "16px",
                  borderRadius: "10px",
                  background: isClient ? "rgba(139,92,246,0.04)" : "rgba(34,197,94,0.04)",
                  border: isClient ? "1px solid rgba(139,92,246,0.1)" : "1px solid rgba(34,197,94,0.1)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: isClient ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "linear-gradient(135deg, #22C55E, #16A34A)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                    }}>
                      {isClient ? (session?.user?.name || "C").charAt(0).toUpperCase() : "S"}
                    </div>
                    <span style={{ color: "#E5E7EB", fontSize: "0.82rem", fontWeight: 600 }}>
                      {isClient ? "You" : "Support Team"}
                    </span>
                    <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>{senderDate}</span>
                  </div>
                  <p style={{ color: "#CBD5E1", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{msg.message}</p>
                </div>
              );
            })}

            {messages.length === 0 && (
              <p style={{ color: "#6B7280", fontSize: "0.85rem", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                No replies yet. Our team will respond shortly.
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Form */}
          {ticket.status !== "closed" ? (
            <form onSubmit={handleReply} style={{ borderTop: "1px solid rgba(139,92,246,0.1)", paddingTop: "20px" }}>
              <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reply</label>
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                required
                style={{
                  width: "100%", background: "rgba(139,92,246,0.04)", border: "1.5px solid rgba(139,92,246,0.15)",
                  borderRadius: "8px", padding: "10px 14px", color: "#E5E7EB", fontSize: "0.88rem",
                  fontFamily: "var(--font-body)", outline: "none", resize: "vertical", boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  style={{
                    padding: "9px 20px", borderRadius: "8px", border: "none",
                    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                    color: "#fff", fontSize: "0.82rem", fontWeight: 700,
                    cursor: sending || !reply.trim() ? "not-allowed" : "pointer",
                    opacity: sending || !reply.trim() ? 0.7 : 1,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ borderTop: "1px solid rgba(139,92,246,0.1)", paddingTop: "16px", textAlign: "center" }}>
              <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: 0 }}>This ticket is closed. No further replies can be sent.</p>
            </div>
          )}
        </div>

        {/* Right Column — Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Details Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Status</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Priority</span>
                <StatusBadge status={ticket.priority} variant="priority" />
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Ticket</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{ticket.ticket_number}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Created</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{new Date(ticket.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Last updated</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{new Date(ticket.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Need help? */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "12px" }}>Need more help?</h3>
            <p style={{ color: "#6B7280", fontSize: "0.82rem", marginBottom: "16px", lineHeight: 1.5 }}>
              Our support team typically responds within 24 hours.
            </p>
            <Link
              href="/portal/dashboard/support"
              style={{
                display: "block", textAlign: "center", padding: "10px 18px", borderRadius: "10px",
                background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
                color: "#C4B5FD", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
              }}
            >
              Back to Support
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portal-ticket-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
