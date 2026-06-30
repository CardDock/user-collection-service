Feature: Find a single card by ID
  As a collector
  I want to get the details of a specific card in my collection
  So that I can view its information

  Background:
    Given the database has cards for multiple users

  Scenario: Get an existing card by its ID
    When I send a GET request to "/api/v1/collections/cards/c1"
    Then the response status should be 200
    And the response body should have property "data.id" with value "c1"
    And the response body should have property "data.cardId" with number 123
    And the response body should have property "data.userId" with value "user-1"
    And the response body should have property "data.condition" with value "MINT"
    And the response body should have property "data.rarity" with value "ULTRA_RARE"
    And the response body should have property "data.quantity" with number 2
    And the response body should have property "data.isFoil" with value "true"
    And the response body should have property "data.language" with value "en"

  Scenario: Return 404 when card does not exist
    When I send a GET request to "/api/v1/collections/cards/nonexistent-id"
    Then the response status should be 404
    And the response should have an error message
