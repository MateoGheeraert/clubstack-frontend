# Refresh Token Implementation

## Overview

This document outlines the implementation of refresh token functionality in the ClubStack frontend application. The implementation ensures users stay authenticated for up to 7 days without needing to log in again every 15 minutes.

## Changes Made

### 1. Updated Type Definitions (`src/types/auth.ts`)

- Modified `AuthResponse` to include optional `refreshToken` field
- Updated `RegisterCredentials` to match backend (removed `name` field)
- Made `User.name` optional since backend doesn't return it
- Added `RegisterResponse` type for registration endpoint response

```typescript
export interface AuthResponse {
  token: string;
  refreshToken?: string;
}
```

### 2. Enhanced Auth Utilities (`src/lib/auth.ts`)

Added refresh token management functions:

- `tokenUtils.getRefreshToken()` - Retrieve refresh token from storage
- `tokenUtils.setRefreshToken()` - Store refresh token in cookies and localStorage
- `tokenUtils.removeRefreshToken()` - Clear refresh token from storage
- Updated `logout()` to also remove refresh tokens

### 3. Automatic Token Refresh (`src/lib/api-client.ts`)

Implemented intelligent token refresh logic:

- Intercepts 401 errors from API
- Automatically attempts to refresh the access token using the refresh token
- Queues failed requests during refresh process
- Retries queued requests with new token after successful refresh
- Redirects to login if refresh fails
- Prevents multiple simultaneous refresh attempts

**How it works:**

1. API call receives 401 (token expired)
2. Interceptor checks for refresh token
3. Calls `/refresh` endpoint with refresh token
4. Receives new access token
5. Retries original request with new token
6. User never notices the refresh happened

### 4. Updated Auth Hooks (`src/lib/hooks/auth.ts`)

- Modified `useLogin()` to store both access and refresh tokens
- Modified `useRegister()` to store both access and refresh tokens
- Added `useLogout()` hook that:
  - Calls `/logout` endpoint with refresh token
  - Clears all tokens and user data
  - Redirects to login page
- Updated API endpoints to match backend:
  - `/login` instead of `/auth/login`
  - `/register` instead of `/auth/register`
  - `/logout` for logout

### 5. Updated UI Components

#### Register Form (`src/components/auth/register-form.tsx`)

- Removed "Full Name" field to match backend API
- Now only collects email and password

#### Sidebar (`src/components/layout/sidebar.tsx`)

- Replaced direct `logout()` call with `useLogout()` hook
- Added loading state during logout
- Shows spinner while logout is in progress

## API Endpoints Used

### Login

```
POST /auth/login
Body: { email, password }
Response: { token, refreshToken }
```

### Register

```
POST /auth/register
Body: { email, password }
Response: { id, email, role }
```

### Refresh Token

```
POST /auth/refresh
Body: { refreshToken }
Response: { token }
```

### Logout

```
POST /auth/logout
Body: { refreshToken }
Response: { message }
```

## Configuration

### API Base URL

The frontend connects to the backend at:

- **Default**: `http://localhost:8000`
- **Override**: Set `NEXT_PUBLIC_API_BASE_URL` environment variable

## Token Storage

Tokens are stored in two places for reliability:

1. **Cookies** - Secure, HTTP-only option (expires in 7 days)
2. **localStorage** - Fallback for client-side access

## Security Features

1. **Automatic token refresh** - Seamless user experience
2. **Request queuing** - Prevents duplicate refresh calls
3. **Graceful degradation** - Falls back to login if refresh fails
4. **Token cleanup** - Removes all tokens on logout
5. **Server-side token invalidation** - Backend invalidates refresh token on logout

## User Experience

- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Users stay logged in for up to 7 days without re-authentication
- Seamless token refresh happens automatically in the background
- No interruption to user workflow when tokens are refreshed

## Testing Checklist

- [ ] Login and verify tokens are stored
- [ ] Wait for access token to expire (15 min) and verify auto-refresh
- [ ] Logout and verify all tokens are cleared
- [ ] Register and verify tokens are stored
- [ ] Test with expired refresh token (should redirect to login)
- [ ] Test logout with network failure (should still clear local tokens)
