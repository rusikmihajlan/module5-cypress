Feature: Practice Software Testing Application Verification

  Scenario: User successfully signs in with valid credentials
    Given the user is on the login page of the website
    When the user enters a valid email address and password
    And the user clicks the login button
    Then the user should be redirected to their account overview page

  Scenario: User updates their profile address details
    Given the user is logged into their account
    When the user navigates to the profile settings page
    And the user updates their street address and clicks save
    Then the profile page should display a success confirmation message

  Scenario: User adds a product to their favorites list
    Given the user is logged in and browsing the item page
    When the user clicks the add to favorites icon on a product
    And the user opens their favorites page
    Then the selected product should appear in the favorites list

  Scenario: User filters products by specific category
    Given the user is viewing the main product catalog
    When the user selects the "Hand Tools" category filter
    And the catalog updates the visible items
    Then only products belonging to the "Hand Tools" category should be displayed
