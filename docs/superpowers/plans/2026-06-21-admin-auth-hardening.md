# Admin Auth Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect admin data and mutations with app-level authentication instead of relying only on Nginx basic auth.

**Architecture:** Add a minimal session-based admin auth layer in Express using an HTTP-only cookie signed by a server secret derived from `ADMIN_PASSWORD`. Expose login/logout/session endpoints, gate `/api/admin-db` behind auth, and show a login form in the React admin page until the session is valid.

**Tech Stack:** React 19, Vite, Express 5, native Node crypto, browser cookies.

---

### Task 1: Server-side admin session helpers

**Files:**
- Create: `lib/adminAuth.js`
- Modify: `server.js`
- Modify: `.env.example`

- [ ] Step 1: Add cookie parsing and session signing helpers.
- [ ] Step 2: Add `/api/admin-login`, `/api/admin-logout`, `/api/admin-session` endpoints.
- [ ] Step 3: Return 401 JSON for protected admin API calls without a valid session.

### Task 2: Protect admin data route

**Files:**
- Modify: `api/admin-db.js`

- [ ] Step 1: Require authenticated admin request before GET/POST access.
- [ ] Step 2: Preserve existing Apps Script behavior after auth passes.

### Task 3: Add admin login UI

**Files:**
- Modify: `src/components/admin/AdminPanel.jsx`
- Modify: `src/components/admin/AdminPanel.css`

- [ ] Step 1: Check `/api/admin-session` before loading admin data.
- [ ] Step 2: Render password login state when unauthenticated.
- [ ] Step 3: Add logout action and handle expired sessions cleanly.

### Task 4: Verify

**Files:**
- Modify: `deploy_notes.md`

- [ ] Step 1: Build the app locally.
- [ ] Step 2: Smoke test auth flow expectations.
- [ ] Step 3: Document that VPS `.env` must keep `ADMIN_PASSWORD` set.
