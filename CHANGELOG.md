# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - yyyy-mm-dd

## [0.3.0] - 2023-12-09

### Added
- Added protected routes for all internal pages (ie. once the user is logged in)
- Organized budget tool as the initial planning page (salary and expense types)
- Limited avaiable expense types to those chosen on initial planning page
- Added a second planning page (allocate budget to each expense type)
- Added track page to view budget progress via a chart using chart.js
- Added a tracker for each expense type
- Added a page to view and delete all expenses (with time stamps, expense type, and amount)

## [Unreleased] - yyyy-mm-dd

## [0.3.0] - 2023-11-08

### Added

- Added protected route for "/" home page
- Added login page/feature
- Added register page/feature
- Added logout capabilities
- Added redirection of unauthorized users to "/auth" login page
- Added redirection of authorized users to "/" home page


## [0.2.0] - 2023-10-13

### Added

- Added Navigation Bar with routing
- Added functionality for Income object in back4app: added CRUD functions for parse/back4app
- Added functionality for Expense object in back4app: added CRUD functions for parse/back4app
- Added an expense form that prompts the user for their expense type and its dollar amount
- Added functionality for Budget object in back4app: added CRUD functions for parse/back4app
- And connected expenses to budget by adding a pointer to the expense object (established 1 to many relationship)
 
## [0.0.0] - 2023-09-25
- Feature 3, which can be found on CodeSandbox