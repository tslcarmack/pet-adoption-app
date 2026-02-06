## ADDED Requirements

### Requirement: Search pets by keyword

The system SHALL allow users to search for pets using text keywords that match against pet name, breed, and description.

#### Scenario: Search by pet name
- **WHEN** user enters "小白" in search box and submits
- **THEN** system displays pets with "小白" in their name
- **THEN** matching text is highlighted in results

#### Scenario: Search by breed
- **WHEN** user enters "金毛" in search box and submits
- **THEN** system displays pets with breed containing "金毛"
- **THEN** breed field shows highlighted match

#### Scenario: Search by description keywords
- **WHEN** user enters "温顺" in search box and submits
- **THEN** system displays pets with "温顺" in description
- **THEN** search term is highlighted in description preview

#### Scenario: No search results
- **WHEN** search query returns no matches
- **THEN** system displays "未找到匹配的宠物" message
- **THEN** system suggests clearing filters or trying different keywords

#### Scenario: Empty search query
- **WHEN** user submits empty search box
- **THEN** system displays all available pets (same as default listing)
- **THEN** search filters remain applied if any

### Requirement: Filter by species

The system SHALL allow users to filter pets by species (dog, cat, etc.).

#### Scenario: Filter by single species
- **WHEN** user selects "狗" from species filter
- **THEN** system displays only pets with species "dog"
- **THEN** selected filter is visually highlighted

#### Scenario: Clear species filter
- **WHEN** user clicks "x" on active species filter
- **THEN** system removes species filter
- **THEN** system displays pets of all species

#### Scenario: Species filter with no results
- **WHEN** user selects species that has no available pets
- **THEN** system displays "当前没有可领养的{species}"
- **THEN** other filters remain applied

### Requirement: Filter by age range

The system SHALL allow users to filter pets by age ranges.

#### Scenario: Filter young pets
- **WHEN** user selects "幼年 (0-1岁)" age filter
- **THEN** system displays pets aged 0 to 12 months
- **THEN** age filter tag is displayed

#### Scenario: Filter adult pets
- **WHEN** user selects "成年 (1-7岁)" age filter
- **THEN** system displays pets aged 1 to 7 years
- **THEN** age filter tag is displayed

#### Scenario: Filter senior pets
- **WHEN** user selects "老年 (7岁+)" age filter
- **THEN** system displays pets aged 7 years or older
- **THEN** age filter tag is displayed

### Requirement: Filter by gender

The system SHALL allow users to filter pets by gender.

#### Scenario: Filter male pets
- **WHEN** user selects "公" gender filter
- **THEN** system displays only male pets
- **THEN** gender filter tag is displayed

#### Scenario: Filter female pets
- **WHEN** user selects "母" gender filter
- **THEN** system displays only female pets
- **THEN** gender filter tag is displayed

### Requirement: Filter by size

The system SHALL allow users to filter pets by size category.

#### Scenario: Filter small pets
- **WHEN** user selects "小型" size filter
- **THEN** system displays pets categorized as small size
- **THEN** size filter tag is displayed

#### Scenario: Filter medium pets
- **WHEN** user selects "中型" size filter
- **THEN** system displays pets categorized as medium size
- **THEN** size filter tag is displayed

#### Scenario: Filter large pets
- **WHEN** user selects "大型" size filter
- **THEN** system displays pets categorized as large size
- **THEN** size filter tag is displayed

### Requirement: Filter by location

The system SHALL allow users to filter pets by geographic location.

#### Scenario: Filter by city
- **WHEN** user selects a city from location dropdown
- **THEN** system displays pets located in that city
- **THEN** location filter tag is displayed with city name

#### Scenario: Filter by multiple cities
- **WHEN** user selects multiple cities
- **THEN** system displays pets from any of the selected cities
- **THEN** all selected city tags are displayed

### Requirement: Combine multiple filters

The system SHALL apply multiple filters simultaneously using AND logic.

#### Scenario: Multiple active filters
- **WHEN** user selects species "狗", age "幼年", and gender "公"
- **THEN** system displays only young male dogs
- **THEN** all active filter tags are displayed
- **THEN** result count shows number of matching pets

#### Scenario: Keyword search with filters
- **WHEN** user searches "金毛" with size "大型" filter active
- **THEN** system displays large dogs matching "金毛"
- **THEN** both search term and filter tags are visible

### Requirement: Clear all filters

The system SHALL allow users to clear all active filters at once.

#### Scenario: Clear all filters button
- **WHEN** user clicks "清除所有筛选" button
- **THEN** system removes all active filters
- **THEN** system displays all available pets
- **THEN** search box is cleared
- **THEN** filter tags disappear

#### Scenario: Clear individual filter
- **WHEN** user clicks "x" on any filter tag
- **THEN** system removes that specific filter
- **THEN** system updates results with remaining filters
- **THEN** that filter tag disappears

### Requirement: Preserve search state in URL

The system SHALL encode search and filter parameters in the URL for sharing and bookmarking.

#### Scenario: Apply filters
- **WHEN** user applies search query and filters
- **THEN** URL updates with query parameters (e.g., ?q=金毛&species=dog&age=young)
- **THEN** user can bookmark or share the URL
- **THEN** opening the URL restores search state

#### Scenario: Browser back navigation
- **WHEN** user clicks browser back button
- **THEN** system restores previous search state
- **THEN** filters and results match previous page

### Requirement: Display active filter summary

The system SHALL display a summary of active filters and result count.

#### Scenario: Filters applied
- **WHEN** user has active filters or search
- **THEN** system displays "显示 X 只宠物" with result count
- **THEN** system displays all active filter tags below search box

#### Scenario: No filters
- **WHEN** no filters or search are active
- **THEN** system displays "显示所有可领养宠物 (X 只)"
- **THEN** filter summary area is empty or shows default message

### Requirement: Provide search suggestions

The system SHALL provide autocomplete suggestions while user types in search box.

#### Scenario: Type breed name
- **WHEN** user types "金" in search box
- **THEN** system displays dropdown with suggestions like "金毛", "金吉拉"
- **THEN** suggestions are based on existing pet breeds

#### Scenario: Select suggestion
- **WHEN** user clicks a suggestion
- **THEN** search box is filled with selected term
- **THEN** search is executed automatically

#### Scenario: No suggestions
- **WHEN** no matching suggestions exist
- **THEN** suggestion dropdown is hidden or shows "无匹配建议"

### Requirement: Mobile filter interface

The system SHALL provide a mobile-optimized filter interface.

#### Scenario: Open mobile filters
- **WHEN** user on mobile device clicks "筛选" button
- **THEN** system opens full-screen or bottom-sheet filter panel
- **THEN** all filter options are displayed in mobile-friendly layout

#### Scenario: Apply mobile filters
- **WHEN** user selects filters in mobile panel and clicks "应用"
- **THEN** system closes filter panel
- **THEN** selected filters are applied to results
- **THEN** filter tags are displayed above results

#### Scenario: Cancel mobile filters
- **WHEN** user clicks "取消" in mobile filter panel
- **THEN** system closes panel without applying changes
- **THEN** previous filter state is maintained
