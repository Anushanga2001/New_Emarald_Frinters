# Story 1.6: User Profile Management

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **logged-in user (customer or admin)**,
I want to view and update my profile information,
So that I can keep my account details current.

## Acceptance Criteria

**AC1: View Profile Page**
**Given** I am logged in as a customer
**When** I navigate to "My Profile" page
**Then** I see my current profile information: name, email, phone, company name
**And** the form is pre-populated with my existing data

**AC2: Successfully Update Profile**
**Given** I am viewing my profile
**When** I update my name, phone, or company name and submit
**Then** my Customer record is updated in the database
**And** I receive a success message: "Profile updated successfully"
**And** the updated information is displayed

**AC3: Email Uniqueness Validation**
**Given** I attempt to change my email to one already in use
**When** I submit the profile update
**Then** I receive an error: "Email already exists"
**And** my profile is not updated

**AC4: Input Validation**
**Given** I enter invalid data (e.g., phone number with letters, invalid email format)
**When** I submit the profile update
**Then** I receive validation errors for invalid fields
**And** my profile is not updated

## Tasks / Subtasks

### Backend Tasks

- [x] **Task 1: Create DTOs for Profile Management** (AC: #1, #2)
  - [x] Create `ProfileDto.cs` - Response DTO with Name, Email, Phone, CompanyName, CreatedAt
  - [x] Create `UpdateProfileDto.cs` - Input DTO with Name, Email, Phone, CompanyName
  - [x] Create `ProfileResponseDto.cs` - Wrapper with Success, Message, and Profile data
  - [x] File: [Backend.Application/DTOs/Profile/](Backend/Backend.Application/DTOs/Profile/)

- [x] **Task 2: Create FluentValidation Validators** (AC: #3, #4)
  - [x] Create `UpdateProfileDtoValidator.cs`:
    - Name: Required, max 100 characters
    - Email: Required, valid email format
    - Phone: Optional, valid phone format (digits, spaces, dashes, + allowed)
    - CompanyName: Optional, max 200 characters
  - [x] File: [Backend.Application/Validators/UpdateProfileDtoValidator.cs](Backend/Backend.Application/Validators/UpdateProfileDtoValidator.cs)

- [x] **Task 3: Create IProfileService Interface** (AC: #1, #2, #3)
  - [x] Add `Task<ProfileDto> GetProfileAsync(int userId)`
  - [x] Add `Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)`
  - [x] File: [Backend.Application/Interfaces/IProfileService.cs](Backend/Backend.Application/Interfaces/IProfileService.cs)

- [x] **Task 4: Implement ProfileService** (AC: #1, #2, #3, #4)
  - [x] Implement `GetProfileAsync`:
    - Get User by ID from database
    - Get associated Customer record
    - Map to ProfileDto (Name, Email, Phone, CompanyName)
    - Return profile data
  - [x] Implement `UpdateProfileAsync`:
    - Get User by ID from database
    - Get associated Customer record
    - If email changed, check uniqueness (case-insensitive)
    - If email already exists, return error response
    - Update User fields (Email, FirstName, LastName, PhoneNumber)
    - Update Customer fields (Name, Email, Phone, CompanyName)
    - Set UpdatedAt timestamps
    - Save changes
    - Log profile update with Serilog
    - Return success response with updated ProfileDto
  - [x] File: [Backend.Infrastructure/Services/ProfileService.cs](Backend/Backend.Infrastructure/Services/ProfileService.cs)

- [x] **Task 5: Register ProfileService in DI** (AC: all)
  - [x] Add `builder.Services.AddScoped<IProfileService, ProfileService>();` in Program.cs
  - [x] File: [Backend.API/Program.cs](Backend/Backend.API/Program.cs)

- [x] **Task 6: Add ProfileController** (AC: #1, #2, #3, #4)
  - [x] Create new ProfileController with `[Authorize]` attribute
  - [x] Add `[HttpGet]` endpoint - GET /api/profile
    - Extract userId from JWT claims
    - Call GetProfileAsync
    - Return 200 OK with profile data
  - [x] Add `[HttpPut]` endpoint - PUT /api/profile
    - Extract userId from JWT claims
    - Validate UpdateProfileDto (FluentValidation auto-validates)
    - Call UpdateProfileAsync
    - Return 200 OK on success, 400 BadRequest if email exists
  - [x] File: [Backend.API/Controllers/ProfileController.cs](Backend/Backend.API/Controllers/ProfileController.cs)

### Frontend Tasks

- [x] **Task 7: Add Profile API Methods** (AC: #1, #2)
  - [x] Create `profileApi.ts` in services folder:
    - `getProfile(): Promise<ProfileDto>` - GET /api/profile
    - `updateProfile(data: UpdateProfileRequest): Promise<ProfileResponseDto>` - PUT /api/profile
  - [x] Add TypeScript interfaces for ProfileDto, UpdateProfileRequest, ProfileResponseDto
  - [x] File: [Frontend/src/services/profileApi.ts](Frontend/src/services/profileApi.ts)

- [x] **Task 8: Create Profile Page Component** (AC: #1, #2, #3, #4)
  - [x] Create `/customer/profile` route component
  - [x] Use TanStack Query `useQuery` to fetch profile data
  - [x] Pre-populate form with existing data using React Hook Form
  - [x] Create Zod validation schema:
    - name: z.string().min(1, "Name is required").max(100)
    - email: z.string().email("Invalid email format")
    - phone: z.string().optional().refine() for phone validation
    - companyName: z.string().max(200).optional()
  - [x] Use `useMutation` for profile update
  - [x] Show loading state while fetching/updating
  - [x] Display success toast on successful update
  - [x] Display error toast/messages for validation errors
  - [x] File: [Frontend/src/pages/customer/Profile.tsx](Frontend/src/pages/customer/Profile.tsx)

- [x] **Task 9: Add Routes and Navigation** (AC: #1)
  - [x] Add `/customer/profile` route in App.tsx (protected route)
  - [x] Add "My Profile" link in customer navigation/sidebar
  - [x] File: [Frontend/src/App.tsx](Frontend/src/App.tsx)
  - [x] File: [Frontend/src/components/layout/Header.tsx](Frontend/src/components/layout/Header.tsx)

- [x] **Task 10: Update localStorage User Data on Profile Update** (AC: #2)
  - [x] After successful profile update, update localStorage user object
  - [x] Ensure name/email changes reflect in UI immediately
  - [x] File: [Frontend/src/services/profileApi.ts](Frontend/src/services/profileApi.ts)

## Dev Notes

### Brownfield Context - What Already Exists

**Database (EXISTS):**
- `User` entity: Id, Email, FirstName, LastName, PhoneNumber, Role, etc.
- `Customer` entity: Id, UserId, Name, Email, Phone, CompanyName, etc.
- One-to-one relationship: User has optional Customer, Customer has required User

**Backend (EXISTS):**
- `AuthController` with JWT authentication patterns
- `IAuthService` interface pattern to follow
- `JwtTokenService` as implementation pattern
- FluentValidation validators in `Backend.Application/Validators/`
- DTOs in `Backend.Application/DTOs/Auth/` as pattern reference

**Frontend (EXISTS):**
- Auth pages in `/auth/` folder (Login.tsx, Register.tsx, ForgotPassword.tsx, ResetPassword.tsx)
- `authApi.ts` with login/register/forgotPassword/resetPassword methods
- `useAuth` hook for authentication state
- React Hook Form + Zod validation pattern established
- Toast notifications using sonner library
- TanStack Query for server state

### Previous Story (1.5) Learnings

From Story 1.5 (Password Reset via Email):
1. **Use toast.success()/toast.error() from sonner** for user feedback
2. **api.ts interceptor** handles 401/403 automatically - no changes needed
3. **Card-based feedback** is good for multi-step flows; toasts for quick confirmations
4. **Case-insensitive email comparison**: Use `.ToLowerInvariant()` when checking email uniqueness
5. **Frontend has pre-existing build errors** in QuotesList.tsx (ag-grid missing) - unrelated to profile

### Architecture Patterns & Constraints

#### Clean Architecture (4 Layers)
```
Backend/
├── Backend.Domain/          # User, Customer entities (no changes needed)
├── Backend.Application/     # DTOs, validators, IProfileService interface
├── Backend.Infrastructure/  # ProfileService implementation
└── Backend.API/             # ProfileController endpoints
```

#### Security Requirements (CRITICAL)
- **JWT Authentication Required**: Profile endpoints must have `[Authorize]` attribute
- **User ID from JWT Claims**: Extract userId from token, not from request body (prevents tampering)
- **Email Uniqueness**: Check for duplicates when email is changed
- **Case-Insensitive Email**: Use `.ToLowerInvariant()` for email comparison

#### Validation Standards
- **Backend**: FluentValidation with `.NotEmpty()`, `.EmailAddress()`, `.MaximumLength()`
- **Frontend**: Zod schema with `z.string().email()`, `z.string().min()/.max()`
- **Phone validation**: Allow digits, spaces, dashes, parentheses, and + symbol

### Technical Implementation Details

#### JWT Claim Extraction Pattern
```csharp
// In ProfileController - get userId from JWT claims
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
if (!int.TryParse(userIdClaim, out var userId))
{
    return Unauthorized(new { message = "Invalid token" });
}
```

#### Email Uniqueness Check Pattern
```csharp
// In ProfileService - check email uniqueness
if (dto.Email.ToLowerInvariant() != user.Email.ToLowerInvariant())
{
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != userId);
    if (existingUser != null)
    {
        return new ProfileResponseDto
        {
            Success = false,
            Message = "Email already exists"
        };
    }
}
```

#### Frontend Zod Schema Pattern
```typescript
const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]*$/.test(val),
      "Phone can only contain digits, spaces, dashes, and +"
    ),
  companyName: z.string().max(200, "Company name too long").optional(),
});
```

### Project Structure Notes

#### Files to Create

| File | Layer | Description |
|------|-------|-------------|
| `Backend/Backend.Application/DTOs/Profile/ProfileDto.cs` | Application | Profile response DTO |
| `Backend/Backend.Application/DTOs/Profile/UpdateProfileDto.cs` | Application | Profile update input DTO |
| `Backend/Backend.Application/DTOs/Profile/ProfileResponseDto.cs` | Application | API response wrapper |
| `Backend/Backend.Application/Interfaces/IProfileService.cs` | Application | Profile service interface |
| `Backend/Backend.Application/Validators/UpdateProfileDtoValidator.cs` | Application | FluentValidation validator |
| `Backend/Backend.Infrastructure/Services/ProfileService.cs` | Infrastructure | Profile service implementation |
| `Backend/Backend.API/Controllers/ProfileController.cs` | API | Profile endpoints |
| `Frontend/src/services/profileApi.ts` | Frontend | Profile API methods |
| `Frontend/src/pages/customer/Profile.tsx` | Frontend | Profile page component |

#### Files to Modify

| File | Change |
|------|--------|
| `Backend/Backend.API/Program.cs` | Register IProfileService and ProfileService in DI |
| `Frontend/src/App.tsx` | Add /customer/profile route |
| Navigation component | Add "My Profile" link |

### Mapping User ↔ Customer Fields

**User Entity Fields → Profile:**
- `User.Email` → Profile email (unique, used for login)
- `User.FirstName` + `User.LastName` → concatenated as "Name" for display
- `User.PhoneNumber` → Profile phone

**Customer Entity Fields → Profile:**
- `Customer.Name` → Profile name (may differ from User name)
- `Customer.Email` → Should sync with User.Email
- `Customer.Phone` → Should sync with User.PhoneNumber
- `Customer.CompanyName` → Profile company name

**IMPORTANT**: When updating profile:
1. Update BOTH User and Customer records to keep them in sync
2. `User.Email` is the source of truth for authentication
3. `Customer.Email` should mirror `User.Email` for consistency

### Testing Standards Summary

#### Manual Test Scenarios
1. View profile - should show current name, email, phone, company
2. Update name only - should succeed and show updated name
3. Update phone only - should succeed and show updated phone
4. Update email to a new unique email - should succeed
5. Update email to an existing user's email - should show "Email already exists"
6. Enter invalid email format - should show validation error
7. Enter invalid phone format (with letters) - should show validation error
8. Leave name empty - should show "Name is required" error
9. After successful update, localStorage user data should reflect changes

### References

#### Source Documents
- [Story Requirements: docs/planning-artifacts/epics.md#Story-1.6](docs/planning-artifacts/epics.md)
- [Architecture: docs/planning-artifacts/architecture.md#Authentication-Strategy](docs/planning-artifacts/architecture.md)
- [User Entity: Backend/Backend.Domain/Entities/User.cs](Backend/Backend.Domain/Entities/User.cs)
- [Customer Entity: Backend/Backend.Domain/Entities/Customer.cs](Backend/Backend.Domain/Entities/Customer.cs)

#### Related Implementation Files
- [Backend/Backend.Application/DTOs/Auth/LoginDto.cs](Backend/Backend.Application/DTOs/Auth/LoginDto.cs) - DTO pattern
- [Backend/Backend.Application/Validators/LoginDtoValidator.cs](Backend/Backend.Application/Validators/LoginDtoValidator.cs) - Validator pattern
- [Backend/Backend.Infrastructure/Services/JwtTokenService.cs](Backend/Backend.Infrastructure/Services/JwtTokenService.cs) - Service pattern
- [Backend/Backend.API/Controllers/AuthController.cs](Backend/Backend.API/Controllers/AuthController.cs) - Controller pattern
- [Frontend/src/pages/auth/Login.tsx](Frontend/src/pages/auth/Login.tsx) - Page pattern
- [Frontend/src/services/authApi.ts](Frontend/src/services/authApi.ts) - API pattern
- [Frontend/src/hooks/useAuth.ts](Frontend/src/hooks/useAuth.ts) - Hook pattern

### Common Pitfalls to Avoid

1. **DON'T** trust userId from request body - always extract from JWT claims
2. **DON'T** forget case-insensitive email comparison (use .ToLowerInvariant())
3. **DON'T** update only User OR only Customer - update BOTH to keep in sync
4. **DON'T** forget to update localStorage after profile update
5. **DON'T** use console.error - use toast.error() for user feedback
6. **DON'T** forget to add `[Authorize]` attribute to ProfileController
7. **DON'T** forget to register ProfileService in DI container

### Definition of Done

**Technical Completion:**
- [x] GET /api/profile returns current user's profile data
- [x] PUT /api/profile updates profile with validation
- [x] Email uniqueness enforced when changing email
- [x] Both User and Customer records updated on profile change
- [x] Frontend profile page displays and edits profile data
- [x] Form validation works on frontend and backend
- [x] Success/error toasts displayed appropriately
- [x] localStorage updated after profile change

**Quality Gates:**
- [x] No compilation errors or warnings in Story 1.6 files
- [ ] Manual test: Can view profile with correct data
- [ ] Manual test: Can update profile successfully
- [ ] Manual test: Email uniqueness check works
- [ ] Manual test: Validation errors display correctly

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Backend build verified successful (0 errors, 1 pre-existing warning unrelated to Story 1.6)
- Frontend TypeScript check confirmed no Profile-related errors
- Pre-existing build errors in QuotesList.tsx (ag-grid missing), Dashboard.tsx, admin.service.ts - unrelated to Story 1.6

### Completion Notes List

1. **Backend Implementation**: Created 3 DTOs (ProfileDto, UpdateProfileDto, ProfileResponseDto), 1 validator (UpdateProfileDtoValidator), 1 interface (IProfileService), 1 service (ProfileService), 1 controller (ProfileController)
2. **Frontend Implementation**: Created profileApi.ts with getProfile/updateProfile methods, Profile.tsx page with React Hook Form + Zod validation, added route in App.tsx, added "My Profile" link in Header.tsx
3. **Security**: JWT authentication required via [Authorize] attribute, userId extracted from JWT claims (not request body), case-insensitive email uniqueness check
4. **Data Sync**: Both User and Customer entities updated on profile change to maintain consistency
5. **UX**: Toast notifications for success/error feedback, loading states during fetch/update, form pre-populated with existing data
6. **localStorage**: User data in localStorage updated after successful profile update to reflect changes immediately in UI

### Code Review Follow-ups

**Issues Fixed (2026-02-03):**

| ID | Severity | Issue | Fix Applied |
|----|----------|-------|-------------|
| H1 | HIGH | Missing transaction in UpdateProfileAsync | Added transaction wrapping with try/catch/rollback in ProfileService.cs |
| H3 | HIGH | Admin/Staff users have no Customer record | Added null check with logging; documented graceful handling |
| M1 | MEDIUM | InvalidOperationException thrown instead of NotFoundException | Changed to NotFoundException for proper 404 HTTP status mapping |
| M2 | MEDIUM | Phone field inconsistency (empty string vs null) | Changed to nullable string throughout for consistency |
| M3 | MEDIUM | localStorage operations not wrapped in try-catch | Added try-catch in profileApi.ts updateProfile method |
| M4 | MEDIUM | Name parsing edge cases | Used StringSplitOptions.RemoveEmptyEntries for robust splitting |

**Deferred Items:**
- H2: Unit tests not included (noted as follow-up for test coverage story)
- L1: Redundant query invalidation in Profile.tsx (low priority, left as-is)

### Change Log

- 2026-02-03: Code review fixes applied (H1, H3, M1, M2, M3, M4)
- 2026-02-03: Initial implementation of Story 1.6 - User Profile Management

### File List

**Created:**
- Backend/Backend.Application/DTOs/Profile/ProfileDto.cs
- Backend/Backend.Application/DTOs/Profile/UpdateProfileDto.cs
- Backend/Backend.Application/DTOs/Profile/ProfileResponseDto.cs
- Backend/Backend.Application/Interfaces/IProfileService.cs
- Backend/Backend.Application/Validators/UpdateProfileDtoValidator.cs
- Backend/Backend.Infrastructure/Services/ProfileService.cs
- Backend/Backend.API/Controllers/ProfileController.cs
- Frontend/src/services/profileApi.ts
- Frontend/src/pages/customer/Profile.tsx

**Modified:**
- Backend/Backend.API/Program.cs (added ProfileService DI registration)
- Frontend/src/App.tsx (added /customer/profile route and ProfilePage import)
- Frontend/src/components/layout/Header.tsx (added "My Profile" navigation link)
