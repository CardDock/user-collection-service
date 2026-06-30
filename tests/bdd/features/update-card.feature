Feature: Update a card in a user's collection
  As a collector
  I want to update the details of a card in my collection
  So that I can keep my inventory accurate

  Background:
    Given the database has cards for multiple users

  Scenario: Update the quantity of a card
    When I send a PATCH request to "/api/v1/collections/cards/c1" with body:
      """
      {
        "quantity": 10
      }
      """
    Then the response status should be 200
    And the response body should have property "data.id" with value "c1"
    And the response body should have property "data.quantity" with number 10

  Scenario: Update the notes of a card
    When I send a PATCH request to "/api/v1/collections/cards/c1" with body:
      """
      {
        "notes": "Updated notes for this card"
      }
      """
    Then the response status should be 200
    And the response body should have property "data.id" with value "c1"
    And the response body should have property "data.notes" with value "Updated notes for this card"

  Scenario: Update the grade of a card
    When I send a PATCH request to "/api/v1/collections/cards/c2" with body:
      """
      {
        "grade": "PSA 10"
      }
      """
    Then the response status should be 200
    And the response body should have property "data.id" with value "c2"
    And the response body should have property "data.grade" with value "PSA 10"

  Scenario: Update the purchase price of a card
    When I send a PATCH request to "/api/v1/collections/cards/c2" with body:
      """
      {
        "purchasePrice": 25.99
      }
      """
    Then the response status should be 200
    And the response body should have property "data.id" with value "c2"
    And the response body should have property "data.purchasePrice" with number 25.99

  Scenario: Update multiple fields at once
    When I send a PATCH request to "/api/v1/collections/cards/c3" with body:
      """
      {
        "quantity": 5,
        "notes": "Multiple fields updated",
        "grade": "NM",
        "purchasePrice": 12.00
      }
      """
    Then the response status should be 200
    And the response body should have property "data.id" with value "c3"
    And the response body should have property "data.quantity" with number 5
    And the response body should have property "data.notes" with value "Multiple fields updated"
    And the response body should have property "data.grade" with value "NM"
    And the response body should have property "data.purchasePrice" with number 12

  Scenario: Return 404 when card does not exist
    When I send a PATCH request to "/api/v1/collections/cards/nonexistent-id" with body:
      """
      {
        "quantity": 1
      }
      """
    Then the response status should be 404
    And the response should have an error message

  Scenario: Return 400 when quantity is less than 1
    When I send a PATCH request to "/api/v1/collections/cards/c1" with body:
      """
      {
        "quantity": 0
      }
      """
    Then the response status should be 400
    And the response should have an error message

  Scenario: Return 400 when sending non-whitelisted fields
    When I send a PATCH request to "/api/v1/collections/cards/c1" with body:
      """
      {
        "cardId": 999
      }
      """
    Then the response status should be 400
    And the response should have an error message
