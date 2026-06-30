Feature: Find cards by user
  As a collector
  I want to list the cards in my collection
  So that I can see what cards I own

  Background:
    Given the database has cards for multiple users

  Scenario: Get all cards for a user
    When I send a GET request to "/api/v1/collections/user-1/cards"
    Then the response status should be 200
    And the response body should have property "data.length" with number 3
    And the response body should have property "meta.page" with number 1
    And the response body should have property "meta.limit" with number 20
    And the response body should have property "meta.total" with number 3
    And the response body should have property "meta.totalPages" with number 1

  Scenario: Filter cards by condition
    When I send a GET request to "/api/v1/collections/user-1/cards?condition=MINT"
    Then the response status should be 200
    And the response body should have property "data.length" with number 1
    And the response body should have property "data[0].condition" with value "MINT"

  Scenario: Filter cards by rarity
    When I send a GET request to "/api/v1/collections/user-1/cards?rarity=SUPER_RARE"
    Then the response status should be 200
    And the response body should have property "data.length" with number 1
    And the response body should have property "data[0].rarity" with value "SUPER_RARE"

  Scenario: Filter cards by edition
    When I send a GET request to "/api/v1/collections/user-1/cards?edition=FIRST_EDITION"
    Then the response status should be 200
    And the response body should have property "data.length" with number 1
    And the response body should have property "data[0].edition" with value "FIRST_EDITION"

  Scenario: Filter cards by isFoil
    When I send a GET request to "/api/v1/collections/user-1/cards?isFoil=true"
    Then the response status should be 200
    And the response body should have property "data.length" with number 1
    And the response body should have property "data[0].isFoil" with value "true"

  Scenario: Paginate results
    When I send a GET request to "/api/v1/collections/user-1/cards?page=1&limit=2"
    Then the response status should be 200
    And the response body should have property "data.length" with number 2
    And the response body should have property "meta.page" with number 1
    And the response body should have property "meta.limit" with number 2
    And the response body should have property "meta.total" with number 3
    And the response body should have property "meta.totalPages" with number 2

  Scenario: Sort cards by cardId ascending
    When I send a GET request to "/api/v1/collections/user-1/cards?sort=cardId&order=asc"
    Then the response status should be 200
    And the response body should have property "data.length" with number 3
    And the response body should have property "data[0].cardId" with number 123

  Scenario: Return empty collection for user with no cards
    When I send a GET request to "/api/v1/collections/nonexistent-user/cards"
    Then the response status should be 200
    And the response body should have property "data.length" with number 0
    And the response body should have property "meta.total" with number 0

  Scenario: Return 400 for invalid enum value
    When I send a GET request to "/api/v1/collections/user-1/cards?condition=INVALID"
    Then the response status should be 400
    And the response should have an error message

  Scenario: Return 400 for limit exceeding maximum
    When I send a GET request to "/api/v1/collections/user-1/cards?limit=200"
    Then the response status should be 400
    And the response should have an error message

  Scenario: Return 400 for invalid sort field
    When I send a GET request to "/api/v1/collections/user-1/cards?sort=invalidField"
    Then the response status should be 400
    And the response should have an error message

  Scenario: Return 400 for negative page number
    When I send a GET request to "/api/v1/collections/user-1/cards?page=-1"
    Then the response status should be 400
    And the response should have an error message
