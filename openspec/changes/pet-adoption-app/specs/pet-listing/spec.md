## ADDED Requirements

### Requirement: Display paginated list of available pets

The system SHALL display a list of pets available for adoption with pagination support. Each pet in the list MUST show basic information including name, species, breed, age, gender, primary photo, and location.

#### Scenario: View first page of pets
- **WHEN** user navigates to the pet listing page
- **THEN** system displays up to 12 pets on the first page
- **THEN** each pet card shows name, species, breed, age, gender, primary photo, and location

#### Scenario: Navigate to next page
- **WHEN** user clicks "Next Page" button
- **THEN** system loads and displays the next 12 pets
- **THEN** page URL updates with the current page number

#### Scenario: Navigate to previous page
- **WHEN** user is on page 2 or higher and clicks "Previous Page" button
- **THEN** system loads and displays the previous 12 pets
- **THEN** page URL updates with the previous page number

#### Scenario: No pets available
- **WHEN** there are no pets in the system
- **THEN** system displays a message "暂无可领养的宠物"
- **THEN** pagination controls are hidden

### Requirement: Display pet status badge

The system SHALL display a status badge on each pet card indicating the pet's availability status.

#### Scenario: Available pet
- **WHEN** pet status is "available"
- **THEN** system displays a green badge with text "可领养"

#### Scenario: Pending adoption
- **WHEN** pet status is "pending"
- **THEN** system displays an orange badge with text "待审核"

#### Scenario: Adopted pet
- **WHEN** pet status is "adopted"
- **THEN** system displays a gray badge with text "已领养"
- **THEN** pet card is visually de-emphasized (reduced opacity)

### Requirement: Navigate to pet details

The system SHALL allow users to navigate to a pet's detail page by clicking on the pet card.

#### Scenario: Click on pet card
- **WHEN** user clicks anywhere on a pet card
- **THEN** system navigates to the pet's detail page at `/pets/{petId}`

#### Scenario: Click on pet photo
- **WHEN** user clicks on a pet's photo
- **THEN** system navigates to the pet's detail page at `/pets/{petId}`

### Requirement: Display loading state

The system SHALL display a loading indicator while fetching pet data.

#### Scenario: Initial page load
- **WHEN** user navigates to the pet listing page
- **THEN** system displays skeleton loaders for pet cards
- **THEN** skeleton loaders are replaced with actual content when data loads

#### Scenario: Page navigation loading
- **WHEN** user clicks pagination controls
- **THEN** system displays loading indicator during data fetch
- **THEN** new pet cards are displayed when data loads

### Requirement: Responsive layout

The system SHALL adapt the pet listing layout based on screen size.

#### Scenario: Desktop view
- **WHEN** viewport width is >= 1024px
- **THEN** system displays pets in a 4-column grid

#### Scenario: Tablet view
- **WHEN** viewport width is between 768px and 1023px
- **THEN** system displays pets in a 3-column grid

#### Scenario: Mobile view
- **WHEN** viewport width is < 768px
- **THEN** system displays pets in a 1-column list

### Requirement: Empty state with call to action

The system SHALL provide a helpful empty state when no pets match the current view.

#### Scenario: No pets in database
- **WHEN** the database has no pets
- **THEN** system displays message "还没有可领养的宠物"
- **THEN** system displays suggestion text "请稍后再来查看"

#### Scenario: All pets adopted
- **WHEN** all pets have status "adopted"
- **THEN** system displays message "所有宠物都已被领养"
- **THEN** system displays suggestion text "感谢您对流浪动物的关注"
