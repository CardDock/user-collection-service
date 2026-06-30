Feature: Remove a card from a user's collection
  As a collector
  I want to remove a card from my collection
  So that I can keep my inventory accurate

  Background:
    Given the database has cards for multiple users

  Scenario: Delete an existing card
    When I send a DELETE request to "/api/v1/collections/cards/c1"
    Then the response status should be 200
    And the response body should be empty

  Scenario: Verify card is actually deleted
    When I send a DELETE request to "/api/v1/collections/cards/c1"
    And I send a GET request to "/api/v1/collections/cards/c1"
    Then the response status should be 404
    And the response should have an error message

  Scenario: Return 404 when card does not exist
    When I send a DELETE request to "/api/v1/collections/cards/nonexistent-id"
    Then the response status should be 404
    And the response should have an error message
