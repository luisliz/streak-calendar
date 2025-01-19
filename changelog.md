# Changelog

All notable changes to this project will be documented in this file.

## [2.0.8] - 2025-01-18

Commit Summary: `perf: optimize completions query with pagination`

### Changed

- Optimized completions query with cursor-based pagination
  - Added limit and cursor support to prevent loading too many records
  - Capped maximum records per request to 100
  - Improved performance for users with many habit completions

## [2.0.7] - 2025-01-17

Commit Summary: `feat: add Buy Me a Coffee button to About page`

### Added

- Added Buy Me a Coffee button to support project development

## [2.0.6] - 2025-01-16

Commit Summary: `refactor: update next-intl to use stable setRequestLocale`

### Changed

- Updated `next-intl` implementation by replacing deprecated `unstable_setRequestLocale` with stable `setRequestLocale`

### Added

- Added changelog.md to track project changes
- Added instructions.md
