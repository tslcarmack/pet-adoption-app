## ADDED Requirements

### Requirement: Add pet to favorites

The system SHALL allow authenticated users to mark pets as favorites for easy access later.

#### Scenario: Add to favorites from listing
- **WHEN** authenticated user clicks heart icon on pet card in listing
- **THEN** system adds pet to user's favorites
- **THEN** heart icon changes from outline to filled
- **THEN** brief success message "已添加到收藏" appears

#### Scenario: Add to favorites from detail page
- **WHEN** authenticated user clicks heart button on pet detail page
- **THEN** system adds pet to user's favorites
- **THEN** heart button changes to filled state
- **THEN** button text changes to "已收藏"

#### Scenario: Unauthenticated user attempts favorite
- **WHEN** unauthenticated user clicks heart icon
- **THEN** system displays login prompt "登录后收藏此宠物"
- **THEN** user is redirected to login page
- **THEN** return URL is set to current page

#### Scenario: Already favorited
- **WHEN** user clicks heart on already-favorited pet
- **THEN** system removes pet from favorites (toggle behavior)
- **THEN** heart icon changes to outline
- **THEN** brief message "已取消收藏" appears

### Requirement: Remove pet from favorites

The system SHALL allow users to remove pets from their favorites list.

#### Scenario: Remove via heart icon
- **WHEN** user clicks filled heart icon on favorited pet
- **THEN** system removes pet from favorites
- **THEN** heart icon changes to outline
- **THEN** success message "已取消收藏" appears

#### Scenario: Remove from favorites page
- **WHEN** user clicks "移除" on favorites page
- **THEN** system removes pet from favorites
- **THEN** pet card is immediately removed from list
- **THEN** success message appears

#### Scenario: Remove last favorite
- **WHEN** user removes their only favorited pet
- **THEN** system shows empty state
- **THEN** message "您还没有收藏任何宠物" is displayed
- **THEN** link to browse pets is shown

### Requirement: View all favorites

The system SHALL display a dedicated page showing all of user's favorited pets.

#### Scenario: View favorites list
- **WHEN** authenticated user navigates to "我的收藏"
- **THEN** system displays grid of all favorited pets
- **THEN** each pet shows photo, name, breed, age, status
- **THEN** pets are sorted by most recently favorited first

#### Scenario: Empty favorites
- **WHEN** user has no favorited pets
- **THEN** system displays empty state illustration
- **THEN** message "您还没有收藏任何宠物" is shown
- **THEN** "浏览宠物" button links to pet listing

#### Scenario: Favorites count badge
- **WHEN** user has favorited pets
- **THEN** header navigation shows "我的收藏 (X)" with count
- **THEN** count updates immediately when adding/removing favorites

### Requirement: Display favorite status indicator

The system SHALL clearly indicate which pets are in user's favorites.

#### Scenario: Favorited pet in listing
- **WHEN** user views pet listing
- **THEN** favorited pets show filled heart icon
- **THEN** non-favorited pets show outline heart icon

#### Scenario: Favorited pet in search results
- **WHEN** user searches and results include favorited pets
- **THEN** favorited pets have filled heart icon
- **THEN** icon state persists across page navigation

### Requirement: Persist favorites across sessions

The system SHALL maintain favorites list across browser sessions and devices.

#### Scenario: Browser restart
- **WHEN** user closes and reopens browser
- **THEN** user's favorites are preserved
- **THEN** heart icons show correct state on page load

#### Scenario: Different device login
- **WHEN** user logs in from different device
- **THEN** all favorites are available
- **THEN** favorites sync across all logged-in sessions

### Requirement: Handle pet status changes in favorites

The system SHALL update favorites list when pet status changes.

#### Scenario: Favorited pet becomes adopted
- **WHEN** favorited pet status changes to "adopted"
- **THEN** pet remains in favorites list
- **THEN** pet card shows "已领养" badge
- **THEN** pet card is visually de-emphasized (reduced opacity)
- **THEN** apply button is disabled or hidden

#### Scenario: Favorited pet becomes pending
- **WHEN** favorited pet status changes to "pending"
- **THEN** pet shows "待审核" badge
- **THEN** if user is not the applicant, apply button is disabled

#### Scenario: Filter adopted pets in favorites
- **WHEN** user toggles "显示已领养" filter on favorites page
- **THEN** system hides pets with "adopted" status
- **THEN** remaining available pets are displayed

### Requirement: Quick actions from favorites

The system SHALL provide convenient actions on favorited pets.

#### Scenario: Quick apply from favorites
- **WHEN** user clicks "申请领养" button on favorite pet card
- **THEN** system navigates to adoption application form
- **THEN** pet information is pre-filled

#### Scenario: Quick view details
- **WHEN** user clicks pet card (not heart icon) in favorites
- **THEN** system navigates to pet detail page

#### Scenario: Share favorited pet
- **WHEN** user clicks share icon on favorite pet card
- **THEN** system shows share options
- **THEN** pet detail URL can be copied or shared

### Requirement: Bulk remove from favorites

The system SHALL allow removing multiple pets from favorites at once.

#### Scenario: Select multiple favorites
- **WHEN** user clicks "编辑" on favorites page
- **THEN** system displays checkboxes on each pet card
- **THEN** user can select multiple pets

#### Scenario: Bulk remove
- **WHEN** user selects multiple pets and clicks "移除选中"
- **THEN** system displays confirmation "确定移除 X 只宠物？"
- **THEN** if confirmed, all selected pets are removed
- **THEN** success message shows count removed

#### Scenario: Cancel bulk mode
- **WHEN** user clicks "取消" in bulk edit mode
- **THEN** checkboxes are hidden
- **THEN** selections are cleared
- **THEN** normal view is restored

### Requirement: Favorite notifications

The system SHALL optionally notify users about changes to their favorited pets.

#### Scenario: Favorited pet status change notification
- **WHEN** favorited pet status changes (e.g., becomes available again)
- **THEN** system can send email notification to user
- **THEN** notification includes pet name, status, and link

#### Scenario: Opt-out of favorite notifications
- **WHEN** user disables notifications in settings
- **THEN** system stops sending favorite-related emails
- **THEN** favorites still function normally

### Requirement: Favorites limit

The system SHALL implement a reasonable limit on number of favorites per user.

#### Scenario: Within favorites limit
- **WHEN** user has fewer than 50 favorites
- **THEN** user can add more pets to favorites
- **THEN** heart icon functions normally

#### Scenario: Reach favorites limit
- **WHEN** user tries to favorite 51st pet
- **THEN** system displays message "收藏已达上限 (50只)，请移除一些后再添加"
- **THEN** favorite action is prevented

#### Scenario: View favorites count
- **WHEN** user views favorites page
- **THEN** system displays "X/50 只宠物" count indicator

### Requirement: Export favorites list

The system SHALL allow users to export their favorites list.

#### Scenario: Export as text
- **WHEN** user clicks "导出收藏" on favorites page
- **THEN** system generates text file with pet details
- **THEN** file includes pet name, breed, age, and detail page URL
- **THEN** file is downloaded to user's device

#### Scenario: Share favorites list
- **WHEN** user clicks "分享我的收藏"
- **THEN** system generates shareable URL with favorites list
- **THEN** URL displays public view of favorites (no personal data)

### Requirement: Sort favorites

The system SHALL allow users to sort their favorites list by different criteria.

#### Scenario: Sort by date added
- **WHEN** user selects "最近收藏" sort option
- **THEN** system displays favorites with newest first

#### Scenario: Sort by pet age
- **WHEN** user selects "年龄" sort option
- **THEN** system displays favorites sorted by pet age (youngest first)

#### Scenario: Sort by species
- **WHEN** user selects "种类" sort option
- **THEN** system groups favorites by species (dogs, cats, others)
- **THEN** within each group, pets sorted by date added
