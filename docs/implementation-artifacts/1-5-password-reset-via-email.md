# Story 1.5: Password Reset via Email

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user who forgot their password**,
I want to reset my password via email verification,
So that I can regain access to my account.

## Acceptance Criteria

**AC1: Forgot Password Request**
**Given** I am on the "Forgot Password" page
**When** I enter my registered email and submit
**Then** a password reset token is generated and stored with 1-hour expiration
**And** I receive a success message: "If that email exists, a reset link has been sent" (security - don't reveal if email exists)
**And** the system logs the password reset request

**AC2: Valid Reset Token Access**
**Given** I receive the password reset email (simulated for now since AR10 defers email)
**When** I click the reset link with valid token
**Then** I am redirected to a "Reset Password" page with the token in URL

**AC3: Successful Password Reset**
**Given** I am on the "Reset Password" page with a valid token
**When** I enter a new password (min 8 chars) and confirm password
**Then** my password is updated with bcrypt hashing
**And** the reset token is invalidated
**And** I receive a success message: "Password reset successful"
**And** I am redirected to the login page

**AC4: Expired Token Handling**
**Given** the reset token has expired (>1 hour old)
**When** I attempt to reset my password
**Then** I receive an error: "Reset link has expired. Please request a new one."

**AC5: Password Mismatch Validation**
**Given** I enter mismatched passwords on reset form
**When** I attempt to reset
**Then** I receive a validation error: "Passwords do not match"

## Tasks / Subtasks

### Backend Tasks

- [x] **Task 1: Create DTOs for Password Reset** (AC: #1, #3, #5)
  - [x] Create `ForgotPasswordDto` with Email property in `Backend.Application/DTOs/Auth/`
  - [x] Create `ResetPasswordDto` with Token, NewPassword, ConfirmPassword properties
  - [x] Create `ForgotPasswordResponseDto` with Message property
  - [x] Create `ResetPasswordResponseDto` with Success and Message properties
  - [x] File: [Backend.Application/DTOs/Auth/](Backend/Backend.Application/DTOs/Auth/)

- [x] **Task 2: Create FluentValidation Validators** (AC: #1, #5)
  - [x] Create `ForgotPasswordDtoValidator` - Email required, valid email format
  - [x] Create `ResetPasswordDtoValidator` - Token required, NewPassword min 8 chars, ConfirmPassword must match
  - [x] File: [Backend.Application/Validators/](Backend/Backend.Application/Validators/)

- [x] **Task 3: Extend IAuthService Interface** (AC: #1, #3, #4)
  - [x] Add `Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto dto)`
  - [x] Add `Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto dto)`
  - [x] File: [Backend.Application/Interfaces/IAuthService.cs](Backend/Backend.Application/Interfaces/IAuthService.cs)

- [x] **Task 4: Implement Password Reset Methods in JwtTokenService** (AC: #1, #3, #4)
  - [x] Implement `ForgotPasswordAsync`:
    - Find user by email (case-insensitive)
    - If not found, return same success message (security)
    - Generate secure token using `Guid.NewGuid().ToString("N")`
    - Set `PasswordResetToken` and `PasswordResetTokenExpiry` (1 hour from now)
    - Log the request with Serilog
    - Return success message (same for both found/not found)
  - [x] Implement `ResetPasswordAsync`:
    - Find user by `PasswordResetToken`
    - If not found or expired, return appropriate error
    - Validate new password matches confirm password
    - Hash new password with BCrypt
    - Clear `PasswordResetToken` and `PasswordResetTokenExpiry`
    - Reset `FailedLoginAttempts` to 0 and clear `LockoutUntil`
    - Log successful password reset
  - [x] File: [Backend.Infrastructure/Services/JwtTokenService.cs](Backend/Backend.Infrastructure/Services/JwtTokenService.cs)

- [x] **Task 5: Add AuthController Endpoints** (AC: #1, #3, #4)
  - [x] Add `[HttpPost("forgot-password")]` endpoint
  - [x] Add `[HttpPost("reset-password")]` endpoint
  - [x] Both endpoints are public (no [Authorize] attribute)
  - [x] Return appropriate HTTP status codes (200 OK for success, 400 BadRequest for validation/expired token)
  - [x] File: [Backend.API/Controllers/AuthController.cs](Backend/Backend.API/Controllers/AuthController.cs)

### Frontend Tasks

- [x] **Task 6: Create ForgotPassword Page** (AC: #1)
  - [x] Create `/auth/forgot-password` route
  - [x] Email input field with validation (required, valid email)
  - [x] Submit button with loading state
  - [x] Success message displayed as card state (not toast - security best practice)
  - [x] Link back to Login page
  - [x] File: [Frontend/src/pages/auth/ForgotPassword.tsx](Frontend/src/pages/auth/ForgotPassword.tsx)

- [x] **Task 7: Create ResetPassword Page** (AC: #2, #3, #4, #5)
  - [x] Create `/auth/reset-password` route with token query parameter
  - [x] Extract token from URL using `useSearchParams()`
  - [x] New password and confirm password fields
  - [x] Client-side validation: min 8 chars, passwords must match
  - [x] Submit button with loading state
  - [x] Success: Show success card and link to login
  - [x] Error handling: Show error card for expired/invalid token
  - [x] File: [Frontend/src/pages/auth/ResetPassword.tsx](Frontend/src/pages/auth/ResetPassword.tsx)

- [x] **Task 8: Add Routes and Navigation** (AC: #1, #2)
  - [x] Add routes in App.tsx for `/auth/forgot-password` and `/auth/reset-password`
  - [x] Add "Forgot Password?" link on Login page below the login form
  - [x] File: [Frontend/src/App.tsx](Frontend/src/App.tsx)
  - [x] File: [Frontend/src/pages/auth/Login.tsx](Frontend/src/pages/auth/Login.tsx)

- [x] **Task 9: Extend authApi Service** (AC: #1, #3)
  - [x] Add `forgotPassword(email: string)` method
  - [x] Add `resetPassword(token: string, newPassword: string, confirmPassword: string)` method
  - [x] File: [Frontend/src/services/authApi.ts](Frontend/src/services/authApi.ts)

## Dev Notes

### Brownfield Context - What Already Exists

**Database (EXISTS):**
- `User` entity has `PasswordResetToken` (string?) and `PasswordResetTokenExpiry` (DateTime?) fields - added in Story 1.1
- No database migration needed - fields already exist

**Backend (EXISTS):**
- `AuthController` with login/register endpoints
- `IAuthService` interface with Login and Register methods
- `JwtTokenService` implementing IAuthService
- `LoginDtoValidator` and `RegisterDtoValidator` patterns to follow
- BCrypt.Net-Next already installed for password hashing

**Frontend (EXISTS):**
- Login.tsx and Register.tsx pages in `/auth/` folder
- authApi.ts with login/register methods
- useAuth hook for authentication state
- React Hook Form + Zod validation pattern
- Toast notifications using sonner library

### Previous Story (1.4) Learnings

From Story 1.4 (Role-Based Access Control):
1. **Use toast from sonner** for all user feedback (not console.error)
2. **api.ts interceptor** already handles 401/403 - no changes needed
3. **Race condition pattern** - consider guards for multiple simultaneous requests
4. Frontend has pre-existing build errors in QuotesList.tsx (ag-grid missing) - unrelated to auth

### Architecture Patterns & Constraints

#### Clean Architecture (4 Layers)
```
Backend/
├── Backend.Domain/          # User entity (already has reset token fields)
├── Backend.Application/     # DTOs, validators, IAuthService interface
├── Backend.Infrastructure/  # JwtTokenService implementation
└── Backend.API/             # AuthController endpoints
```

#### Security Requirements (CRITICAL)
- **Same message for found/not found email** - Prevents email enumeration attacks
- **Token expiration** - 1 hour maximum for security
- **Token invalidation** - Must be cleared after successful reset
- **BCrypt hashing** - Use BCrypt.Net.BCrypt.HashPassword() with default work factor
- **Account lockout reset** - Clear FailedLoginAttempts and LockoutUntil on password reset

#### Validation Standards
- **Backend**: FluentValidation with `.NotEmpty()`, `.EmailAddress()`, `.MinimumLength(8)`
- **Frontend**: Zod schema with `z.string().email()`, `z.string().min(8)`
- **Password confirmation**: Must match on both frontend and backend

### Technical Implementation Details

#### Token Generation
```csharp
// Secure token generation
var token = Guid.NewGuid().ToString("N"); // 32 hex characters, no hyphens
user.PasswordResetToken = token;
user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
```

#### Password Reset Flow
1. User enters email on Forgot Password page
2. Backend generates token, stores in User entity
3. Backend returns success message (same for both found/not found)
4. **Note**: Email sending deferred to Epic 7 (AR10) - for now, token is logged for testing
5. User navigates to Reset Password page with token in URL
6. User enters new password + confirmation
7. Backend validates token, updates password, clears token
8. User redirected to login

#### Frontend URL Pattern
```
/auth/forgot-password          # Forgot password form
/auth/reset-password?token=xxx # Reset password form with token
```

### Project Structure Notes

#### Files to Create

| File | Layer | Description |
|------|-------|-------------|
| `Backend/Backend.Application/DTOs/Auth/ForgotPasswordDto.cs` | Application | Email input DTO |
| `Backend/Backend.Application/DTOs/Auth/ResetPasswordDto.cs` | Application | Token + passwords DTO |
| `Backend/Backend.Application/DTOs/Auth/ForgotPasswordResponseDto.cs` | Application | Response DTO |
| `Backend/Backend.Application/DTOs/Auth/ResetPasswordResponseDto.cs` | Application | Response DTO |
| `Backend/Backend.Application/Validators/ForgotPasswordDtoValidator.cs` | Application | Email validation |
| `Backend/Backend.Application/Validators/ResetPasswordDtoValidator.cs` | Application | Password validation |
| `Frontend/src/pages/auth/ForgotPassword.tsx` | Frontend | Forgot password page |
| `Frontend/src/pages/auth/ResetPassword.tsx` | Frontend | Reset password page |

#### Files to Modify

| File | Change |
|------|--------|
| `Backend.Application/Interfaces/IAuthService.cs` | Add ForgotPasswordAsync, ResetPasswordAsync |
| `Backend.Infrastructure/Services/JwtTokenService.cs` | Implement new methods |
| `Backend.API/Controllers/AuthController.cs` | Add new endpoints |
| `Frontend/src/services/authApi.ts` | Add API methods |
| `Frontend/src/App.tsx` | Add routes |
| `Frontend/src/pages/auth/Login.tsx` | Add forgot password link |

### Testing Standards Summary

#### Manual Test Scenarios
1. Request reset for existing email - should show success message
2. Request reset for non-existing email - should show same success message (security)
3. Use valid token within 1 hour - should allow password reset
4. Use expired token (>1 hour) - should show expiration error
5. Enter mismatched passwords - should show validation error
6. Successfully reset password - should be able to login with new password
7. Try to reuse reset token - should fail (token cleared)

### References

#### Source Documents
- [Story Requirements: docs/planning-artifacts/epics.md#Story-1.5](docs/planning-artifacts/epics.md)
- [Architecture: docs/planning-artifacts/architecture.md#Authentication-Strategy](docs/planning-artifacts/architecture.md)
- [User Entity: Backend/Backend.Domain/Entities/User.cs](Backend/Backend.Domain/Entities/User.cs)

#### Related Implementation Files
- [Backend/Backend.Application/DTOs/Auth/LoginDto.cs](Backend/Backend.Application/DTOs/Auth/LoginDto.cs) - DTO pattern
- [Backend/Backend.Application/Validators/LoginDtoValidator.cs](Backend/Backend.Application/Validators/LoginDtoValidator.cs) - Validator pattern
- [Backend/Backend.Infrastructure/Services/JwtTokenService.cs](Backend/Backend.Infrastructure/Services/JwtTokenService.cs) - Auth service
- [Frontend/src/pages/auth/Login.tsx](Frontend/src/pages/auth/Login.tsx) - Page pattern
- [Frontend/src/services/authApi.ts](Frontend/src/services/authApi.ts) - API pattern

### Common Pitfalls to Avoid

1. **DON'T** reveal if email exists - always return same success message
2. **DON'T** use predictable tokens - use cryptographically secure generation (Guid)
3. **DON'T** forget to clear token after successful reset
4. **DON'T** forget to reset account lockout (FailedLoginAttempts, LockoutUntil)
5. **DON'T** use console.error - use toast.error() for user feedback
6. **DON'T** forget case-insensitive email lookup (use .ToLowerInvariant())

### Definition of Done

**Technical Completion:**
- [x] Forgot Password endpoint returns success for both existing and non-existing emails
- [x] Reset token generated with 1-hour expiration
- [x] Reset Password endpoint validates token and updates password
- [x] Expired tokens are rejected with appropriate error
- [x] Password confirmation validation works on frontend and backend
- [x] Account lockout state cleared on password reset
- [x] Forgot Password link added to Login page
- [x] Both pages use card-based feedback (more appropriate for this flow than toasts)

**Quality Gates:**
- [x] No compilation errors or warnings in Story 1.5 files
- [ ] Manual test: Forgot password flow works
- [ ] Manual test: Reset password flow works
- [ ] Manual test: Expired token shows error
- [ ] Manual test: Can login with new password after reset

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Backend build verified successful
- Frontend build has pre-existing errors in QuotesList.tsx (ag-grid missing), Dashboard.tsx, admin.service.ts - unrelated to Story 1.5
- Story 1.5 specific files compile without errors

### Completion Notes List

1. **Backend Implementation**: Created 4 DTOs, 2 validators, extended IAuthService interface, implemented ForgotPasswordAsync and ResetPasswordAsync in JwtTokenService, added 2 new endpoints in AuthController
2. **Frontend Implementation**: Created ForgotPassword.tsx and ResetPassword.tsx pages following established patterns, added routes in App.tsx, added "Forgot password?" link in Login.tsx, extended authApi service
3. **Security**: Same message returned for both existing and non-existing emails (prevents email enumeration), token expires in 1 hour, token invalidated after use, account lockout reset on password change
4. **Design Decision**: Used card-based success/error states instead of toasts for password reset flow (better UX for multi-step flows)

### File List

**Created:**
- Backend/Backend.Application/DTOs/Auth/ForgotPasswordDto.cs
- Backend/Backend.Application/DTOs/Auth/ResetPasswordDto.cs
- Backend/Backend.Application/DTOs/Auth/ForgotPasswordResponseDto.cs
- Backend/Backend.Application/DTOs/Auth/ResetPasswordResponseDto.cs
- Backend/Backend.Application/Validators/ForgotPasswordDtoValidator.cs
- Backend/Backend.Application/Validators/ResetPasswordDtoValidator.cs
- Frontend/src/pages/auth/ForgotPassword.tsx
- Frontend/src/pages/auth/ResetPassword.tsx

**Modified:**
- Backend/Backend.Application/Interfaces/IAuthService.cs
- Backend/Backend.Infrastructure/Services/JwtTokenService.cs
- Backend/Backend.API/Controllers/AuthController.cs
- Frontend/src/services/authApi.ts
- Frontend/src/App.tsx
- Frontend/src/pages/auth/Login.tsx
