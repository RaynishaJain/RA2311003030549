# Architectural Analysis: Campus Notification System
**Author**: Academic Candidate Assessment (Round 2)

## Stage 1: API Specifications & Endpoint Contracts

### System Objectives
* **Broadcast Announcements**: Allow authorized administrators and staff to post critical updates to specific academic groups.
* **Student Feed Retrieval**: Enable students to dynamically view updates filtered for their curriculum.
* **View Tracking**: Update read-receipt flags when users click on individual notifications.

### API Specifications

#### 1. Publish Notification
* **Route**: `POST /api/v1/notifications`
* **Request Headers**:
  * `Authorization: Bearer <valid_access_token>`
  * `Content-Type: application/json`
* **Payload Structure**:
```json
{
  "title": "Placement Drive",
  "message": "CSX Corporation hiring begins next week.",
  "type": "Placement"
}