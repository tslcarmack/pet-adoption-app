## ADDED Requirements

### Requirement: View profile information

The system SHALL display the user's profile information including name, email, phone, and account creation date.

#### Scenario: View own profile
- **WHEN** authenticated user navigates to profile page
- **THEN** system displays user's name, email, phone number
- **THEN** system displays account creation date
- **THEN** system displays email verification status

#### Scenario: Unverified email indicator
- **WHEN** user's email is not verified
- **THEN** system displays warning badge next to email
- **THEN** system provides "发送验证邮件" button

### Requirement: Edit profile information

The system SHALL allow users to update their name and phone number.

#### Scenario: Update name
- **WHEN** user updates name field and clicks "保存"
- **THEN** system validates name is not empty
- **THEN** system updates name in database
- **THEN** system displays success message "资料已更新"
- **THEN** updated name appears in UI immediately

#### Scenario: Update phone number
- **WHEN** user updates phone number and clicks "保存"
- **THEN** system validates phone format (optional field)
- **THEN** system updates phone in database
- **THEN** system displays success message

#### Scenario: Invalid phone format
- **WHEN** user enters invalid phone number
- **THEN** system displays error "请输入有效的手机号码"
- **THEN** changes are not saved

#### Scenario: Email cannot be edited
- **WHEN** user views email field
- **THEN** email field is read-only or disabled
- **THEN** tooltip explains "邮箱地址不可修改"

### Requirement: Change password

The system SHALL allow authenticated users to change their password.

#### Scenario: Successful password change
- **WHEN** user provides current password, new password, and confirmation
- **THEN** system verifies current password is correct
- **THEN** system validates new password meets requirements
- **THEN** system validates new password matches confirmation
- **THEN** system updates password hash
- **THEN** system displays "密码已更改"

#### Scenario: Incorrect current password
- **WHEN** user provides wrong current password
- **THEN** system displays error "当前密码不正确"
- **THEN** password is not changed

#### Scenario: New password too weak
- **WHEN** user provides new password not meeting requirements
- **THEN** system displays specific error (e.g., "密码至少需要8个字符")
- **THEN** password requirements are highlighted

#### Scenario: Password confirmation mismatch
- **WHEN** new password and confirmation don't match
- **THEN** system displays error "两次输入的密码不一致"
- **THEN** confirmation field is highlighted

### Requirement: View adoption history

The system SHALL display a list of the user's past and current adoption applications.

#### Scenario: View application list
- **WHEN** user navigates to "我的申请" tab
- **THEN** system displays all applications with pet name, photo, status, and submission date
- **THEN** applications are sorted by submission date (newest first)

#### Scenario: No applications yet
- **WHEN** user has no adoption applications
- **THEN** system displays "您还没有提交过领养申请"
- **THEN** system shows link to browse available pets

#### Scenario: Click application
- **WHEN** user clicks on an application
- **THEN** system navigates to application detail page
- **THEN** detail page shows full application and status history

### Requirement: Display application status badges

The system SHALL clearly indicate the status of each adoption application.

#### Scenario: Pending application
- **WHEN** application status is "pending"
- **THEN** system displays orange badge "待审核"
- **THEN** submitted date is shown

#### Scenario: Approved application
- **WHEN** application status is "approved"
- **THEN** system displays green badge "已通过"
- **THEN** approval date and next steps are shown

#### Scenario: Rejected application
- **WHEN** application status is "rejected"
- **THEN** system displays red badge "未通过"
- **THEN** rejection reason is displayed if provided

### Requirement: View favorites list

The system SHALL display all pets the user has marked as favorites.

#### Scenario: View favorites
- **WHEN** user navigates to "我的收藏" tab
- **THEN** system displays grid of favorited pets
- **THEN** each pet shows photo, name, breed, and current status

#### Scenario: No favorites
- **WHEN** user has no favorited pets
- **THEN** system displays "您还没有收藏任何宠物"
- **THEN** system shows link to browse pets

#### Scenario: Remove from favorites
- **WHEN** user clicks "移除" on a favorite
- **THEN** system removes pet from favorites
- **THEN** pet is immediately removed from list
- **THEN** success message "已取消收藏" appears

#### Scenario: Favorited pet adopted
- **WHEN** favorite list includes adopted pet
- **THEN** pet card shows "已领养" badge
- **THEN** pet remains in favorites but appears visually de-emphasized

### Requirement: Upload profile avatar

The system SHALL allow users to upload a custom profile photo.

#### Scenario: Upload new avatar
- **WHEN** user selects image file and clicks "上传"
- **THEN** system validates file is image format (jpg, png, webp)
- **THEN** system validates file size is under 2MB
- **THEN** system uploads to Cloudinary
- **THEN** system updates user avatar URL
- **THEN** new avatar appears immediately

#### Scenario: Invalid file type
- **WHEN** user tries to upload non-image file
- **THEN** system displays error "请上传图片文件 (JPG, PNG, WEBP)"
- **THEN** upload is rejected

#### Scenario: File too large
- **WHEN** user tries to upload file over 2MB
- **THEN** system displays error "图片大小不能超过 2MB"
- **THEN** upload is rejected

#### Scenario: Remove avatar
- **WHEN** user clicks "移除头像"
- **THEN** system removes custom avatar
- **THEN** system displays default avatar (initials or icon)

### Requirement: Delete account

The system SHALL allow users to permanently delete their account.

#### Scenario: Initiate account deletion
- **WHEN** user clicks "删除账户" in settings
- **THEN** system displays confirmation modal with warning
- **THEN** modal explains data will be permanently deleted

#### Scenario: Confirm account deletion
- **WHEN** user confirms deletion and enters password
- **THEN** system verifies password
- **THEN** system deletes user account and all associated data
- **THEN** system logs user out
- **THEN** system redirects to home page with message "账户已删除"

#### Scenario: Cancel account deletion
- **WHEN** user clicks "取消" in confirmation modal
- **THEN** modal closes
- **THEN** no data is deleted
- **THEN** user remains on profile page

#### Scenario: Pending applications prevent deletion
- **WHEN** user has pending adoption applications
- **THEN** system displays warning "您有待审核的申请，无法删除账户"
- **THEN** system suggests withdrawing applications first
- **THEN** deletion is blocked

### Requirement: Profile completeness indicator

The system SHALL display profile completeness status to encourage users to fill in all information.

#### Scenario: Incomplete profile
- **WHEN** user has not filled in phone number or avatar
- **THEN** system displays "个人资料 60% 完成" progress indicator
- **THEN** system shows suggestions to complete profile

#### Scenario: Complete profile
- **WHEN** user has filled all optional fields
- **THEN** system displays "个人资料已完善" with checkmark
- **THEN** profile completeness indicator shows 100%

### Requirement: Activity timeline

The system SHALL display a timeline of user's recent activity related to pet adoption.

#### Scenario: View activity feed
- **WHEN** user navigates to "动态" tab
- **THEN** system displays chronological list of activities:
  - Applications submitted
  - Applications status changes
  - Pets favorited
  - Profile updates
- **THEN** each activity shows timestamp and description

#### Scenario: No activity
- **WHEN** user has no activity
- **THEN** system displays "暂无活动记录"
- **THEN** system encourages browsing pets

### Requirement: Privacy settings

The system SHALL allow users to control visibility of their profile information.

#### Scenario: Make phone number private
- **WHEN** user toggles "公开手机号" to off
- **THEN** phone number is hidden from rescue organizations
- **THEN** setting is saved immediately

#### Scenario: Profile visibility
- **WHEN** user toggles "公开我的领养历史" to off
- **THEN** adoption history is only visible to user
- **THEN** rescue organizations cannot see past applications to other pets
