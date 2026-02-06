## ADDED Requirements

### Requirement: Display adoption application form

The system SHALL present a comprehensive adoption application form for users to submit their interest in adopting a specific pet.

#### Scenario: Open application form
- **WHEN** authenticated user clicks "申请领养" on available pet
- **THEN** system displays application form
- **THEN** form shows pet name and photo at top
- **THEN** form pre-fills user's name, email, phone from profile

#### Scenario: Unauthenticated user attempts application
- **WHEN** unauthenticated user clicks "申请领养"
- **THEN** system redirects to login page
- **THEN** return URL is set to application form for this pet

#### Scenario: Already submitted application
- **WHEN** user has existing application for this pet
- **THEN** system redirects to existing application status page
- **THEN** system displays message "您已提交过此宠物的领养申请"

### Requirement: Collect applicant information

The system SHALL collect necessary information to evaluate adoption suitability.

#### Scenario: Required fields
- **WHEN** user views application form
- **THEN** form includes required fields marked with asterisk:
  - Full name
  - Email address
  - Phone number
  - Residential address
  - Housing type (own/rent)
  - Living situation (house/apartment/other)
  - Household members count

#### Scenario: Optional fields
- **WHEN** user views application form
- **THEN** form includes optional fields:
  - Occupation
  - Monthly income range
  - Have yard (yes/no)

### Requirement: Collect pet experience information

The system SHALL ask about the applicant's experience with pets.

#### Scenario: Previous pet ownership
- **WHEN** user selects "是" for "您之前养过宠物吗?"
- **THEN** system displays follow-up questions:
  - What type of pet
  - How many years of experience
  - What happened to previous pet

#### Scenario: No previous experience
- **WHEN** user selects "否" for previous pet ownership
- **THEN** follow-up questions are hidden
- **THEN** system displays info text about first-time pet ownership responsibilities

#### Scenario: Current pets
- **WHEN** user indicates they currently have pets
- **THEN** system asks for details:
  - Number and type of current pets
  - Are they vaccinated
  - How they will interact with new pet

### Requirement: Collect adoption motivation

The system SHALL require applicants to explain their reasons for adoption.

#### Scenario: Motivation essay field
- **WHEN** user views form
- **THEN** system displays text area "为什么想领养这只宠物?"
- **THEN** field has minimum 50 characters requirement
- **THEN** character counter shows current/minimum

#### Scenario: Insufficient motivation
- **WHEN** user enters less than 50 characters
- **THEN** system displays error "请至少输入50个字符说明领养理由"
- **THEN** form cannot be submitted

### Requirement: Validate form data

The system SHALL validate all form inputs before submission.

#### Scenario: Required fields validation
- **WHEN** user attempts to submit with empty required fields
- **THEN** system highlights empty fields in red
- **THEN** system displays error "请填写所有必填项"
- **THEN** form scrolls to first error

#### Scenario: Phone number validation
- **WHEN** user enters invalid phone format
- **THEN** system displays error "请输入有效的手机号码"
- **THEN** field is highlighted

#### Scenario: Email validation
- **WHEN** user enters invalid email format
- **THEN** system displays error "请输入有效的邮箱地址"
- **THEN** field is highlighted

### Requirement: Save draft automatically

The system SHALL automatically save form progress to prevent data loss.

#### Scenario: Auto-save draft
- **WHEN** user types in form and pauses for 3 seconds
- **THEN** system saves draft to browser localStorage
- **THEN** system displays "草稿已保存" indicator briefly

#### Scenario: Restore draft
- **WHEN** user returns to incomplete application
- **THEN** system prompts "是否恢复之前的草稿?"
- **THEN** if user clicks "恢复", form is filled with saved data

#### Scenario: Clear draft after submission
- **WHEN** user successfully submits application
- **THEN** system clears saved draft from localStorage

### Requirement: Submit adoption application

The system SHALL allow users to submit completed application forms.

#### Scenario: Successful submission
- **WHEN** user submits valid application form
- **THEN** system validates all fields
- **THEN** system creates application record with status "pending"
- **THEN** system sends confirmation email to user
- **THEN** system notifies rescue organization
- **THEN** system redirects to application confirmation page

#### Scenario: Server error on submission
- **WHEN** submission fails due to server error
- **THEN** system displays error "提交失败，请稍后重试"
- **THEN** form data is preserved
- **THEN** user can retry submission

#### Scenario: Pet becomes unavailable during submission
- **WHEN** pet status changes to "pending" or "adopted" during application
- **THEN** system displays error "此宠物已不再接受新申请"
- **THEN** form is disabled
- **THEN** user can view other available pets

### Requirement: Display submission confirmation

The system SHALL show confirmation after successful application submission.

#### Scenario: Confirmation page
- **WHEN** application is successfully submitted
- **THEN** system displays success message
- **THEN** page shows application ID and submission timestamp
- **THEN** page explains next steps and expected review timeline
- **THEN** page provides link to view application status

### Requirement: View application status

The system SHALL allow applicants to view their application status and details.

#### Scenario: View pending application
- **WHEN** user views application with "pending" status
- **THEN** system displays all submitted information
- **THEN** system shows "待审核" status badge
- **THEN** system shows submission date
- **THEN** system displays estimated review time "通常在3-5个工作日内审核"

#### Scenario: View approved application
- **WHEN** user views approved application
- **THEN** system displays "已通过" status badge
- **THEN** system shows approval date and reviewer notes
- **THEN** system displays next steps for adoption completion
- **THEN** system shows rescue organization contact information

#### Scenario: View rejected application
- **WHEN** user views rejected application
- **THEN** system displays "未通过" status badge
- **THEN** system shows rejection reason if provided
- **THEN** system suggests browsing other pets
- **THEN** system allows user to submit new applications

### Requirement: Withdraw pending application

The system SHALL allow users to withdraw pending applications.

#### Scenario: Withdraw application
- **WHEN** user clicks "撤回申请" on pending application
- **THEN** system displays confirmation modal "确定要撤回此申请吗?"
- **THEN** if confirmed, application status changes to "withdrawn"
- **THEN** system sends notification to rescue organization
- **THEN** pet becomes available for other applicants again

#### Scenario: Cannot withdraw approved application
- **WHEN** user views approved application
- **THEN** "撤回申请" button is not displayed
- **THEN** system displays contact information to discuss with organization

### Requirement: Track application timeline

The system SHALL record and display key events in the application process.

#### Scenario: View application timeline
- **WHEN** user views application detail page
- **THEN** system displays timeline with events:
  - Application submitted (date/time)
  - Application under review (if applicable)
  - Application decision (approved/rejected with date)
- **THEN** timeline shows most recent event at top

#### Scenario: Status update notification
- **WHEN** application status changes
- **THEN** system sends email notification to applicant
- **THEN** email includes application ID, pet name, new status
- **THEN** email includes link to view application details

### Requirement: Prevent duplicate applications

The system SHALL prevent users from submitting multiple applications for the same pet.

#### Scenario: Existing pending application
- **WHEN** user tries to apply for pet they already applied for
- **THEN** system redirects to existing application page
- **THEN** system displays "您已提交过此宠物的领养申请"

#### Scenario: Reapply after rejection
- **WHEN** user's previous application was rejected
- **THEN** system allows submitting new application after 30 days
- **THEN** if within 30 days, system displays "请在30天后重新申请"

#### Scenario: Approved application restriction
- **WHEN** user has approved application for another pet
- **THEN** system restricts applying for additional pets
- **THEN** system displays "您有一个待完成的领养，请完成后再申请其他宠物"

### Requirement: Admin review interface (for rescue organizations)

The system SHALL provide interface for rescue organizations to review applications.

#### Scenario: View pending applications
- **WHEN** admin views pet detail page
- **THEN** system shows count of pending applications
- **THEN** admin can click to view application list

#### Scenario: Review application
- **WHEN** admin opens an application
- **THEN** system displays all applicant information
- **THEN** system displays "通过" and "拒绝" action buttons
- **THEN** system provides text area for reviewer notes

#### Scenario: Approve application
- **WHEN** admin clicks "通过"
- **THEN** system changes application status to "approved"
- **THEN** system changes pet status to "pending"
- **THEN** system sends approval email to applicant
- **THEN** system rejects all other pending applications for this pet

#### Scenario: Reject application
- **WHEN** admin clicks "拒绝" and provides reason
- **THEN** system changes application status to "rejected"
- **THEN** system sends rejection email with reason to applicant
- **THEN** pet remains available for other applicants
