# Campus Notifications System Design

## Stage 1
* Target Actions: Submit, retrieve, and acknowledge notifications.
* Core API contracts: `POST /api/v1/notifications`, `GET /api/v1/notifications`.

## Stage 2
* Persistent Storage Choice: PostgreSQL
* Reason: Relational structure tracks specific reading matrices efficiently with robust data consistency.

## Stage 3
To speed up slow queries on `notifications` table, create a compound index:
```sql
CREATE INDEX idx_student_unread ON student_notifications (student_id, is_read, created_at DESC);