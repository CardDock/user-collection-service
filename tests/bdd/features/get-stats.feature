Feature: Get collection statistics for a user
  As a collector
  I want to see statistics about my collection
  So that I can understand its composition and value

  Background:
    Given the database has cards for multiple users

  Scenario: Get statistics for a user with cards
    When I send a GET request to "/api/v1/collections/user-1/stats"
    Then the response status should be 200
    And the response body should have property "data.totalEntries" with number 3
    And the response body should have property "data.totalQuantity" with number 6
    And the response body should have property "data.uniqueCardIds" with number 3

  Scenario: Get statistics breakdown by rarity
    When I send a GET request to "/api/v1/collections/user-1/stats"
    Then the response status should be 200
    And the response body should have property "data.byRarity.ULTRA_RARE" with number 1
    And the response body should have property "data.byRarity.SUPER_RARE" with number 1
    And the response body should have property "data.byRarity.COMMON" with number 1

  Scenario: Get statistics breakdown by condition
    When I send a GET request to "/api/v1/collections/user-1/stats"
    Then the response status should be 200
    And the response body should have property "data.byCondition.MINT" with number 1
    And the response body should have property "data.byCondition.NEAR_MINT" with number 1
    And the response body should have property "data.byCondition.PLAYED" with number 1

  Scenario: Get statistics breakdown by edition
    When I send a GET request to "/api/v1/collections/user-1/stats"
    Then the response status should be 200
    And the response body should have property "data.byEdition.FIRST_EDITION" with number 1
    And the response body should have property "data.byEdition.UNLIMITED" with number 2

  Scenario: Get statistics for a user with no cards
    When I send a GET request to "/api/v1/collections/nonexistent-user/stats"
    Then the response status should be 200
    And the response body should have property "data.totalEntries" with number 0
    And the response body should have property "data.totalQuantity" with number 0
    And the response body should have property "data.uniqueCardIds" with number 0
