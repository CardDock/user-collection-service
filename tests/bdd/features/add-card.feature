Feature: Add a card to a user's collection
  As a collector
  I want to add a new card to my collection
  So that I can track my inventory

  Background:
    Given the database has cards for multiple users

  Scenario: Add a new card to a user's collection
    When I send a POST request to "/api/v1/collections/user-1/cards" with body:
      """
      {
        "cardId": 999,
        "condition": "MINT",
        "rarity": "COMMON",
        "edition": "FIRST_EDITION",
        "isFoil": false,
        "language": "en",
        "quantity": 1
      }
      """
    Then the response status should be 201
    And the response body should have property "data.cardId" with number 999
    And the response body should have property "data.userId" with value "user-1"
    And the response body should have property "data.quantity" with number 1

  Scenario: Increment quantity when adding a duplicate card
    When I send a POST request to "/api/v1/collections/user-1/cards" with body:
      """
      {
        "cardId": 123,
        "condition": "MINT",
        "rarity": "ULTRA_RARE",
        "edition": "FIRST_EDITION",
        "isFoil": true,
        "language": "en",
        "quantity": 3
      }
      """
    Then the response status should be 201
    And the response body should have property "data.cardId" with number 123
    And the response body should have property "data.quantity" with number 5

  Scenario: Add a card with all optional fields
    When I send a POST request to "/api/v1/collections/user-1/cards" with body:
      """
      {
        "cardId": 555,
        "condition": "NEAR_MINT",
        "rarity": "ULTRA_RARE",
        "edition": "UNLIMITED",
        "isFoil": true,
        "language": "en",
        "quantity": 2,
        "notes": "Near mint condition",
        "grade": "9",
        "purchasePrice": 15.50
      }
      """
    Then the response status should be 201
    And the response body should have property "data.quantity" with number 2
    And the response body should have property "data.notes" with value "Near mint condition"
    And the response body should have property "data.grade" with value "9"
    And the response body should have property "data.purchasePrice" with number 15.5

  Scenario: Return 400 when required fields are missing
    When I send a POST request to "/api/v1/collections/user-1/cards" with body:
      """
      {
        "condition": "MINT"
      }
      """
    Then the response status should be 400
    And the response should have an error message

  Scenario: Return 400 when cardId is not a number
    When I send a POST request to "/api/v1/collections/user-1/cards" with body:
      """
      {
        "cardId": "not-a-number",
        "condition": "MINT",
        "rarity": "COMMON",
        "edition": "FIRST_EDITION",
        "isFoil": false,
        "language": "en"
      }
      """
    Then the response status should be 400
    And the response should have an error message

  Scenario: Return 400 when condition enum is invalid
    When I send a POST request to "/api/v1/collections/user-1/cards" with body:
      """
      {
        "cardId": 777,
        "condition": "INVALID_CONDITION",
        "rarity": "COMMON",
        "edition": "FIRST_EDITION",
        "isFoil": false,
        "language": "en"
      }
      """
    Then the response status should be 400
    And the response should have an error message
