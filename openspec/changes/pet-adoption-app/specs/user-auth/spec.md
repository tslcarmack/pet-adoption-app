## ADDED Requirements

### Requirement: Register new user account

The system SHALL allow users to create a new account using email and password.

#### Scenario: Successful registration
- **WHEN** user submits valid email, password, and name
- **THEN** system creates new user account
- **THEN** system sends confirmation email
- **THEN** system redirects to home page with logged-in state

#### Scenario: Duplicate email
- **WHEN** user tries to register with existing email
- **THEN** system displays error "此邮箱已被注册"
- **THEN** form remains on registration page
- **THEN** password field is cleared for security

#### Scenario: Invalid email format
- **WHEN** user submits invalid email format
- **THEN** system displays error "请输入有效的邮箱地址"
- **THEN** email field is highlighted in red

#### Scenario: Weak password
- **WHEN** user submits password shorter than 8 characters
- **THEN** system displays error "密码至少需要8个字符"
- **THEN** password requirements are displayed

#### Scenario: Password requirements
- **WHEN** user focuses on password field
- **THEN** system displays password requirements:
  - At least 8 characters
  - Contains at least one letter
  - Contains at least one number

### Requirement: Login with email and password

The system SHALL allow registered users to login using their email and password credentials.

#### Scenario: Successful login
- **WHEN** user submits correct email and password
- **THEN** system authenticates user
- **THEN** system creates session with JWT token
- **THEN** system redirects to previous page or home page

#### Scenario: Incorrect password
- **WHEN** user submits correct email but wrong password
- **THEN** system displays error "邮箱或密码错误"
- **THEN** password field is cleared
- **THEN** system logs failed login attempt

#### Scenario: Non-existent email
- **WHEN** user submits email that doesn't exist
- **THEN** system displays error "邮箱或密码错误"
- **THEN** system does not reveal that email doesn't exist (security)

#### Scenario: Account locked
- **WHEN** user account is locked due to too many failed attempts
- **THEN** system displays error "账户已被锁定，请30分钟后重试"
- **THEN** login form is disabled

### Requirement: Logout

The system SHALL allow authenticated users to logout and end their session.

#### Scenario: User logout
- **WHEN** authenticated user clicks "退出登录"
- **THEN** system invalidates JWT token
- **THEN** system clears authentication cookies
- **THEN** system redirects to home page
- **THEN** user state changes to unauthenticated

### Requirement: Password reset

The system SHALL allow users to reset forgotten passwords via email verification.

#### Scenario: Request password reset
- **WHEN** user submits email on "忘记密码" page
- **THEN** system sends password reset email with token
- **THEN** system displays "重置链接已发送到邮箱"
- **THEN** reset token expires after 30 minutes

#### Scenario: Click reset email link
- **WHEN** user clicks reset link from email
- **THEN** system validates token
- **THEN** system displays password reset form
- **THEN** form pre-fills email (read-only)

#### Scenario: Set new password
- **WHEN** user submits new password via reset form
- **THEN** system validates password requirements
- **THEN** system updates password hash
- **THEN** system invalidates reset token
- **THEN** system displays "密码已重置，请登录"
- **THEN** system redirects to login page

#### Scenario: Expired reset token
- **WHEN** user clicks reset link after 30 minutes
- **THEN** system displays "重置链接已过期"
- **THEN** system provides link to request new reset

#### Scenario: Invalid reset token
- **WHEN** user submits tampered or invalid token
- **THEN** system displays "无效的重置链接"
- **THEN** system provides link to request new reset

### Requirement: Protected routes

The system SHALL restrict access to certain pages based on authentication status.

#### Scenario: Unauthenticated access to protected page
- **WHEN** unauthenticated user tries to access `/profile` or `/applications`
- **THEN** system redirects to `/login?returnUrl={originalUrl}`
- **THEN** after login, system redirects back to original URL

#### Scenario: Authenticated access
- **WHEN** authenticated user navigates to protected page
- **THEN** system allows access
- **THEN** page loads normally

### Requirement: Session persistence

The system SHALL maintain user session across page reloads and browser restarts.

#### Scenario: Page reload
- **WHEN** authenticated user reloads page
- **THEN** system verifies JWT token
- **THEN** user remains logged in
- **THEN** user data is restored

#### Scenario: Browser restart
- **WHEN** user closes and reopens browser
- **THEN** system checks for valid session cookie
- **THEN** if token valid, user remains logged in
- **THEN** if token expired, user must login again

#### Scenario: Token expiration
- **WHEN** JWT token expires (after 7 days)
- **THEN** system logs user out automatically
- **THEN** system displays "会话已过期，请重新登录"
- **THEN** system redirects to login page

### Requirement: Rate limiting for authentication

The system SHALL implement rate limiting to prevent brute force attacks.

#### Scenario: Too many login attempts
- **WHEN** user fails login 5 times within 15 minutes
- **THEN** system blocks further login attempts from that IP
- **THEN** system displays "尝试次数过多，请30分钟后重试"
- **THEN** block expires after 30 minutes

#### Scenario: Too many registration attempts
- **WHEN** multiple registration attempts from same IP within short time
- **THEN** system implements CAPTCHA verification
- **THEN** user must complete CAPTCHA to proceed

### Requirement: Display authentication state in UI

The system SHALL clearly indicate authentication status in the user interface.

#### Scenario: Authenticated user header
- **WHEN** user is logged in
- **THEN** header displays user name or avatar
- **THEN** header shows dropdown with "个人资料", "我的申请", "我的收藏", "退出登录"

#### Scenario: Unauthenticated user header
- **WHEN** user is not logged in
- **THEN** header displays "登录" and "注册" buttons
- **THEN** certain features show login prompt on interaction

### Requirement: Email verification

The system SHALL send verification email after registration to confirm email address.

#### Scenario: Send verification email
- **WHEN** user completes registration
- **THEN** system sends email with verification link
- **THEN** link contains secure token
- **THEN** token expires after 24 hours

#### Scenario: Verify email
- **WHEN** user clicks verification link
- **THEN** system validates token
- **THEN** system marks email as verified
- **THEN** system displays "邮箱验证成功" message

#### Scenario: Unverified email reminder
- **WHEN** user with unverified email logs in
- **THEN** system displays banner "请验证您的邮箱地址"
- **THEN** banner includes "重新发送验证邮件" link

#### Scenario: Resend verification email
- **WHEN** user clicks "重新发送验证邮件"
- **THEN** system sends new verification email
- **THEN** system displays "验证邮件已发送"
- **THEN** user can only resend once per 5 minutes

### Requirement: Secure password storage

The system SHALL securely store user passwords using industry-standard hashing.

#### Scenario: Password hashing on registration
- **WHEN** user registers with password
- **THEN** system hashes password using bcrypt with cost factor 10
- **THEN** system stores only hash, never plain text
- **THEN** hash is unique even for identical passwords (salt)

#### Scenario: Password verification on login
- **WHEN** user attempts login
- **THEN** system retrieves stored hash
- **THEN** system compares submitted password against hash using bcrypt
- **THEN** plain text password is never logged or stored
