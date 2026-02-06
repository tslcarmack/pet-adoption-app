## ADDED Requirements

### Requirement: Display complete pet information

The system SHALL display comprehensive information about a pet including name, species, breed, age, gender, size, description, health status, vaccination status, location, and adoption status.

#### Scenario: View available pet details
- **WHEN** user navigates to a pet detail page
- **THEN** system displays all pet information fields
- **THEN** pet status badge is displayed prominently

#### Scenario: View adopted pet details
- **WHEN** user views a pet with status "adopted"
- **THEN** system displays all pet information
- **THEN** adoption application button is disabled or hidden
- **THEN** status shows "已领养" with adoption date if available

### Requirement: Display photo gallery

The system SHALL display all photos of the pet in an interactive gallery with navigation controls.

#### Scenario: View multiple photos
- **WHEN** pet has multiple photos
- **THEN** system displays primary photo as main image
- **THEN** system displays thumbnail navigation below main image
- **THEN** user can click thumbnails to change main image

#### Scenario: Navigate photos with arrows
- **WHEN** user clicks left/right arrow buttons
- **THEN** system displays the previous/next photo
- **THEN** corresponding thumbnail is highlighted

#### Scenario: Single photo
- **WHEN** pet has only one photo
- **THEN** system displays the single photo
- **THEN** navigation controls are hidden

#### Scenario: No photos
- **WHEN** pet has no photos
- **THEN** system displays a placeholder image
- **THEN** placeholder shows pet species icon or generic pet image

### Requirement: Provide adoption application action

The system SHALL provide a clear call-to-action for users to start the adoption application process.

#### Scenario: Available pet - authenticated user
- **WHEN** pet status is "available" and user is logged in
- **THEN** system displays "申请领养" button prominently
- **THEN** button click navigates to adoption application form

#### Scenario: Available pet - unauthenticated user
- **WHEN** pet status is "available" and user is not logged in
- **THEN** system displays "登录后申请领养" button
- **THEN** button click redirects to login page with return URL

#### Scenario: Pending or adopted pet
- **WHEN** pet status is "pending" or "adopted"
- **THEN** adoption application button is not displayed
- **THEN** status message explains pet is unavailable

#### Scenario: User already applied
- **WHEN** logged-in user has already submitted application for this pet
- **THEN** system displays "已申请" badge
- **THEN** system shows application status (pending/approved/rejected)
- **THEN** adoption application button is disabled

### Requirement: Display health and vaccination information

The system SHALL clearly display the pet's health status and vaccination records.

#### Scenario: Vaccinated pet
- **WHEN** pet vaccination status is "complete"
- **THEN** system displays green checkmark with "已完成疫苗接种"
- **THEN** system shows vaccination details if available

#### Scenario: Partially vaccinated pet
- **WHEN** pet vaccination status is "partial"
- **THEN** system displays orange icon with "部分疫苗已接种"
- **THEN** system shows which vaccines are pending

#### Scenario: Not vaccinated pet
- **WHEN** pet vaccination status is "none"
- **THEN** system displays "未接种疫苗" warning
- **THEN** system displays recommendation to complete vaccination after adoption

#### Scenario: Health issues
- **WHEN** pet has documented health issues
- **THEN** system displays health status section with details
- **THEN** health information is clearly visible before application

### Requirement: Enable favorite/unfavorite action

The system SHALL allow authenticated users to add or remove pets from their favorites.

#### Scenario: Add to favorites
- **WHEN** authenticated user clicks unfilled heart icon
- **THEN** system adds pet to user's favorites
- **THEN** heart icon changes to filled state
- **THEN** success message appears briefly

#### Scenario: Remove from favorites
- **WHEN** authenticated user clicks filled heart icon
- **THEN** system removes pet from user's favorites
- **THEN** heart icon changes to unfilled state
- **THEN** success message appears briefly

#### Scenario: Unauthenticated favorite attempt
- **WHEN** unauthenticated user clicks heart icon
- **THEN** system displays login prompt
- **THEN** user is redirected to login page with return URL

### Requirement: Display contact information

The system SHALL display contact information for inquiries about the pet.

#### Scenario: View contact info
- **WHEN** user scrolls to contact section
- **THEN** system displays rescue organization name
- **THEN** system displays phone number (if public)
- **THEN** system displays email for inquiries

#### Scenario: Click phone number
- **WHEN** user clicks phone number on mobile device
- **THEN** device initiates phone call

#### Scenario: Click email
- **WHEN** user clicks email address
- **THEN** system opens default email client with pre-filled recipient

### Requirement: Provide social sharing

The system SHALL enable users to share pet details on social media or via link.

#### Scenario: Copy share link
- **WHEN** user clicks "分享" button and selects "复制链接"
- **THEN** system copies pet detail page URL to clipboard
- **THEN** success message "链接已复制" appears

#### Scenario: Share to social media
- **WHEN** user clicks social media share button
- **THEN** system opens sharing dialog with pet info and photo
- **THEN** shared content includes pet name, photo, and detail page link

### Requirement: Handle pet not found

The system SHALL gracefully handle requests for non-existent pets.

#### Scenario: Invalid pet ID
- **WHEN** user navigates to `/pets/{invalidId}`
- **THEN** system displays "宠物不存在" error message
- **THEN** system displays link to return to pet listing page

#### Scenario: Deleted pet
- **WHEN** user navigates to a previously valid pet that has been deleted
- **THEN** system displays "此宠物信息已被移除" message
- **THEN** system displays link to browse other available pets

### Requirement: Display page metadata for SEO

The system SHALL set appropriate page title and meta tags for each pet detail page.

#### Scenario: Available pet page
- **WHEN** search engine crawls pet detail page
- **THEN** page title is "{Pet Name} - {Species} - 宠物领养"
- **THEN** meta description includes pet name, breed, age, and brief description
- **THEN** Open Graph tags include pet photo for social previews
