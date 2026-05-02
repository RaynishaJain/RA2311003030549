# Campus Notifications System Design

## Stage 1: API Design & Contract

### Core Actions
* **Post Notification (Admin/Staff)**: Send announcements to specific groups of students.
* **Fetch Notifications (Student)**: Allow students to retrieve updates relevant to them.
* **Mark as Read**: Mark individual notifications as read once viewed.

### API Contracts

#### 1. Create Notification
* **Endpoint**: `POST /api/v1/notifications`
* **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "title": "Placement Drive",
  "message": "CSX Corporation hiring begins next week.",
  "type": "Placement"
}