# Phase 10 — Communication & Notifications

**Status:** COMPLETE

## Database Changes
- `notifications` table: id, user_id (FK users), type, title, message, link, is_read, created_at

## Implemented

### Admin Notifications
- Bell icon in admin header with unread count badge
- Dropdown with recent 10 notifications, mark read, mark all read
- Full notifications page at `/admin/notifications` with pagination, unread filter
- Notifications wired into: lead created, lead assigned, follow-up assigned, ticket created, ticket replied
- `notifyAllAdmins()` broadcasts to all admin/agent users
- Polls unread count every 60s

### Client Notifications
- Bell icon in portal header with unread count badge
- Dropdown with recent notifications, mark read, mark all read
- Scoped strictly to client's own user_id via `requireClient()`
- Client notification actions: getClientNotifications, getClientUnreadCount, markClientNotificationRead, markAllClientNotificationsRead

### Notification Triggers
- Lead created → all admins notified
- Lead assigned → assignee notified
- Follow-up assigned → assignee notified
- Support ticket created → all admins notified
- Client replied to ticket → all admins notified

### Shared Infrastructure
- `lib/actions/notifications.ts` — shared `createNotificationForUser()` and `notifyAllAdmins()` used by both admin.ts and portal.ts

## Verification
- TypeScript: PASS (0 errors)
- Build: PASS (44 routes)
- No email sending — notification records only (no email provider configured)
