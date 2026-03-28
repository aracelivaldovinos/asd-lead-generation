# ASD Lead Generation
A JavaScript client that embeds on education publisher websites and powers the school discovery and lead generation experience. It connects prospective students to schools by showing program listings, collecting Request for Information form submissions, and routing users through a conversion funnel. 

## Architecture (rebuild)
 
> **Jamstack Monorepo · Serverless SSR · Domain-Driven Packages**

 ### Key design decisions
 
**Domain package first.** All business logic (banding tiers, school exclusions, attribution rules, RFI question sequencing) lives in `packages/domain` — pure TypeScript with zero framework dependencies. This makes it 100% unit testable and means business rule changes only touch one package.
 
**Internal Mapping Service as Anti-Corruption Layer.** `packages/services` talks to a single internal endpoint that handles all provider complexity. New providers (Eddy, ASD API, future providers) are added to the mapping service only — clientapi never changes when a new data source is added.
 
**No global state pollution.** The old `window.ASD_SETTINGS` global is replaced by `data-settings` attributes on the script tag. The new loader reads config synchronously without polluting the global scope.
 
**Consistent merge strategy.** The old codebase had a bug: `api_settings.js` used `_.merge()` (deep) while `minimal/api_settings.js` used `Object.assign()` (shallow), causing different behavior in nested config objects between the main and min builds. The rebuild uses a single consistent strategy everywhere.

## Architecture (legacy)
 
> **Layered frontend monolith with legacy seams**

The original system was built in three generations of technology that were layered on top of each other without removing the previous generation:

### Why it needed a rebuild
 
 Structural problems:
 
1. **Business logic scattered** — banding tiers, school exclusions, attribution rules, GTM routing, and RFI whitelists were embedded in settings objects, utility files, and UI components with no dedicated domain layer.
2. **Global mutable state** — `window.ASD_SETTINGS` was written by the WordPress plugin and mutated by the loader, components, and settings modules throughout the lifecycle.
3. **Two UI frameworks coexisting** — React was added on top of Backbone but Backbone was never removed. Both are active.
4. **Duplication between main and minimal** — `util/` and `util/minimal/` are largely copy-paste duplicates, meaning bug fixes needed to be made twice.
5. **No feature boundaries** — everything organized by technical type (components/, views/, models/). No concept of a "listings feature" or "RFI feature" — code for a single user flow spread across 6+ directories.
