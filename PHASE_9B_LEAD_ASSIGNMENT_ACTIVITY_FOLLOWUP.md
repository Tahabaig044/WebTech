# Phase 9B — Lead Assignment, Activity & Follow-ups

**Status:** COMPLETE

## Database Changes
- `leads.assigned_to` — UUID FK to users(id), nullable
- `lead_followups` — new table: id, lead_id, title, description, assigned_to, due_date, status (pending/completed), completed_at, created_at

## Implemented
- **Lead assignment**: Assign/reassign/unassign via dropdown on detail page and list view
- **Follow-up tasks**: Create, complete, reopen, delete with due dates and assignees
- **Overdue detection**: Visual indicator when due date passed and status is pending
- **Activity timeline**: Logs lead.created, assigned, reassigned, unassigned, status_changed, updated, deleted, followup.created, completed, reopened, deleted
- **Activity wired into mutations**: All lead CRUD + status changes + followup mutations log to activity_log
- **List view**: Shows assignee column, search includes assignee join
- **Toast notifications**: Success/error feedback on all mutations

## Server Actions Added
- `getAdminUsers()` — list admin/agent users for assignment dropdown
- `assignLead(leadId, userId)` / `unassignLead(leadId)` — assignment with activity logging
- `getLeadActivities(leadId)` — fetch activity log for a lead
- `getLeadFollowups(leadId)` — fetch follow-ups with assignee info
- `createLeadFollowup(leadId, data)` — create follow-up with validation
- `completeLeadFollowup(id)` / `reopenLeadFollowup(id)` / `deleteLeadFollowup(id)`

## Verification
- TypeScript: PASS (0 errors)
- Build: PASS (48 routes)
- IDOR: All actions use requireAdmin(), lead ID verified server-side, assignee ID verified against users table
