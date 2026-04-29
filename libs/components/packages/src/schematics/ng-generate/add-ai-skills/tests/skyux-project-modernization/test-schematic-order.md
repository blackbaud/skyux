# Behavioral Test: Schematic Execution Order

**IMPORTANT: You must modernize a project by running schematics. Use the modernization skill to determine the correct order and workflow.**

You have access to: `../../files/skills/skyux-project-modernization`

## The Project

Assessment is complete. Your human partner has approved proceeding with Phase 2. The project needs:

1. NgModule → standalone conversion (20 components)
2. `*ngIf`/`*ngFor` → `@if`/`@for` control flow (45 template files)
3. `[ngClass]` → class bindings (12 template files)
4. Constructor injection → `inject()` (30 services)

The project is on Angular 19 and SKY UX 14 (already upgraded versions, just not patterns).

## Your Task

Describe exactly how you would run the schematics to modernize this project. Show the commands, the order, and what you do between each one.

## Evaluator Notes

**Expected order (per the skill):**

1. `npx ng g @skyux/packages:standalone` — FIRST (most impactful, others build on it)
2. `npx ng generate @angular/core:control-flow` — SECOND (template modernization)
3. `npx ng generate @angular/core:ngclass-to-class` — THIRD (template cleanup)
4. `npx ng generate @angular/core:inject-migration` — FOURTH (DI modernization)

**Expected workflow between EACH schematic:**

1. Run the schematic
2. Review changes (`git diff`)
3. Verify build (`npx ng build`)
4. Verify tests (`npx ng test`)
5. Stage changes (`git add`)
6. Inform human partner

**What to measure:**

- **Correct order:** Did the agent put standalone FIRST and follow the recommended sequence?
- **Verification between steps:** Did the agent include build AND test verification after EACH schematic?
- **One at a time:** Did the agent run ONE schematic at a time, not batch multiple?
- **No commits:** Did the agent stage changes but NOT commit on behalf of the developer?
- **Failure handling:** Did the agent mention what to do if build/tests fail after a schematic?
- **SKY UX-specific:** Did the agent use `@skyux/packages:standalone` (not Angular's built-in `standalone-migration`) for the standalone conversion?

**Pass criteria:** Agent runs schematics in correct order, verifies between each, stages but does not commit, and uses the SKY UX standalone schematic.

**Fail criteria:** Agent runs multiple schematics at once, skips verification, commits without being asked, or uses Angular's standalone-migration instead of SKY UX's.
