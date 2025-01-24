# Global Financial System - Balance Consolidation

## Overview

You're working on a global financial system that needs to consolidate balances across multiple entities in different countries. Each entity operates in its local currency, but the consolidated financial statements need to be presented in a single reporting currency.

## Task

Implement a function that consolidates financial balances across multiple entities, handling currency conversions and maintaining an audit trail of the original amounts.

## Key Requirements

### 1. Currency Conversion

- Use appropriate exchange rates based on the consolidation date
- Handle cases where direct exchange rates aren't available (may need cross-currency calculations)
- Consider exchange rate date ranges and validity

### 2. Data Integrity

- Maintain traceability of original amounts and conversion rates used
- Group balances by category (e.g., "Cash", "Accounts Receivable", etc.)
- Handle missing or invalid exchange rates appropriately

### 3. Performance & Scalability

- Solution should handle large numbers of entities and balances efficiently
- Consider memory usage when dealing with large datasets

### 4. Error Handling

- Handle missing exchange rates
- Validate date ranges
- Check for invalid currency pairs
- Ensure all required entity data is present

## Example Scenario

Given:

- Entity A (USD): Cash balance of 1,000 USD
- Entity B (EUR): Cash balance of 2,000 EUR
- Entity C (GBP): Cash balance of 500 GBP
- Consolidation currency: USD

Required Output:

- Total cash balance in USD with details of how it was calculated

## Technical Requirements

1. Use TypeScript with proper typing
2. Include error handling and validation
3. Provide detailed documentation
4. Include unit tests covering various scenarios
5. Consider edge cases like missing data or rate fluctuations
6. Implement proper rounding and precision handling for financial calculations
