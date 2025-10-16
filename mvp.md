# Clubstack MVP Frontend Specification

This document describes the MVP frontend for **Clubstack**, implemented using:

- **Next.js (App Router)** → Pages and layouts
- **TanStack Query** → Data fetching, caching, and mutations
- **shadcn/ui** → Components (forms, tables, modals, navigation, etc.)
- **JWT Auth** → Secure requests to backend

---

## 🔑 Authentication

### Login Page

- **UI**:
  - `shadcn/ui` form with Email + Password inputs
  - Submit button
- **API Call**: `POST /auth/login`
- **State Management**: Save JWT in `localStorage/session`
- **TanStack Query**: Mutation for login
- **Next.js**: Redirect to `/dashboard` after login

### Register Page

- **UI**:
  - `shadcn/ui` form with Name, Email, Password
- **API Call**: `POST /auth/register`
- **Next.js**: Redirect to `/login`

---

## 🏠 Dashboard

### Layout

- **Sidebar (shadcn/ui navigation)**:
  - Dashboard
  - My Tasks
  - Activities
  - Accounts & Transactions
  - Organizations (Admin only)
  - Profile
- **Topbar**:
  - Active organization selector (`GET /organizations/my`)
  - User dropdown (profile/logout)

### Widgets

- Organizations: `GET /organizations/my`
- Recent Tasks: `GET /tasks/my?limit=5`
- Upcoming Activities: `GET /activities/upcoming`
- Accounts Overview: `GET /accounts/my`

---

## 🏢 Organizations

### My Organizations (User)

- **UI**: List of cards with org info
- **API**:
  - List: `GET /organizations/my`
  - Detail: `GET /organizations/:id`

### Organization Management (Admin)

- **UI**: Table of all organizations
- **API**:
  - Create: `POST /organizations`
  - Edit: `PATCH /organizations/:id`
  - Delete: `DELETE /organizations/:id`
  - Add User: `POST /organizations/:id/users`
  - Remove User: `DELETE /organizations/:id/users/:userId`
  - User’s Orgs: `GET /organizations/users/:userId`

---

## ✅ Tasks

### My Tasks (User)

- **UI**: Table with filters (status, pagination)
- **API**:
  - List: `GET /tasks/my?status=&page=&limit=`
  - Detail: `GET /tasks/:id`
  - Update Status: `PATCH /tasks/:id/status`

### Task Management (Admin)

- **UI**: Org-wide task list
- **API**:
  - All Tasks: `GET /tasks?status=&userId=`
  - Create: `POST /tasks`
  - Update: `PATCH /tasks/:id`
  - Reassign: `PATCH /tasks/:id/assign`
  - Delete: `DELETE /tasks/:id`

---

## 📅 Activities

### User

- **UI**: Calendar view + list
- **API**:
  - Upcoming: `GET /activities/upcoming`
  - By Org: `GET /activities/organization/:organizationId`
  - Detail: `GET /activities/:id`

### Admin

- **API**:
  - Create: `POST /activities`
  - Edit: `PATCH /activities/:id`
  - Delete: `DELETE /activities/:id`
  - Add Attendee: `POST /activities/:id/attendees`
  - Remove Attendee: `DELETE /activities/:id/attendees/:attendee`

---

## 💰 Accounts & Transactions

### Accounts Overview

- **UI**: Card/list with balances
- **API**:
  - My Accounts: `GET /accounts/my`
  - By Org: `GET /accounts/organization/:organizationId`
  - Detail: `GET /accounts/:id`

### Transactions

- **UI**: Table (columns: date, type, amount, code, description)
- **API**:
  - By Account: `GET /transactions/account/:accountId`
  - Filtered: `GET /transactions?transactionCode=CODE&dateRange=...`
  - Detail: `GET /transactions/:id`

### Admin

- **Accounts**:
  - Create: `POST /accounts`
  - Edit: `PATCH /accounts/:id`
  - Delete: `DELETE /accounts/:id`
- **Transactions**:
  - Create: `POST /transactions`
  - Edit: `PATCH /transactions/:id`
  - Delete: `DELETE /transactions/:id`

---

## 👤 Profile & Stats

### Profile Page

- **UI**: Card with user info + org memberships
- **API**: `GET /user/profile`

### Stats

- **UI**: Counters / small cards
- **API**: `GET /user/stats`

---

## ⚙️ Implementation Notes

- **Next.js App Router**:
  - Use `app/` directory for route-based layout
  - Protected routes via middleware (`middleware.ts`) checking JWT
- **TanStack Query**:
  - `useQuery` for GET requests
  - `useMutation` for POST/PATCH/DELETE
  - Query invalidation on mutations (e.g., tasks list refresh after task update)
- **shadcn/ui**:
  - Forms (login, register, create/edit entities)
  - Tables (tasks, transactions, orgs)
  - Dialogs (create/edit forms)
  - Navigation (sidebar + topbar)

---

# 📌 Role-based Access

- **Users**:
  - `/organizations/my`
  - `/tasks/my`
  - `/activities/organization/:orgId`
  - `/accounts/my`
- **Admins**:
  - Full CRUD on organizations, tasks, activities, accounts, and transactions

---

# 🔄 Example Flow

1. User logs in → `POST /auth/login`
2. Dashboard loads:
   - Orgs → `GET /organizations/my`
   - Tasks → `GET /tasks/my?limit=5`
   - Activities → `GET /activities/upcoming`
   - Accounts → `GET /accounts/my`
3. User selects org → Org Detail (`GET /organizations/:id`)
4. From org:
   - View tasks → `GET /tasks/my`
   - Check activities → `GET /activities/organization/:orgId`
   - Manage account → `GET /accounts/organization/:orgId` + `GET /transactions/account/:accId`
