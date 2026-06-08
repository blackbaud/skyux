---
applyTo: '**/apps/e2e/*-storybook/src/app/**/*.stories.ts'
description: 'SKY UX Copilot instructions for authoring Storybook visual-test stories for components in the e2e storybook apps.'
---

# SKY UX Copilot Instructions: Visual-Test Stories

## Overview

Visual tests are Storybook stories that live in the per-library e2e apps at
`apps/e2e/<library>-storybook/`. Each story renders a component in a known
state so Percy can capture a visual snapshot during CI. Prefer generating
stories with the `@skyux-sdk/e2e-schematics:story` generator and then editing
the output; do not hand-build the surrounding app wiring.

## File Structure and Naming

- **Storybook app**: `apps/e2e/<library>-storybook/` (tag `component-e2e`,
  prefix `app`). Created once per library by the
  `@skyux-sdk/e2e-schematics:component-e2e` generator.
- **Story location**: `apps/e2e/<library>-storybook/src/app/<name>/`
  containing the wrapper component (`<name>.component.ts/.html/.scss`), its
  module (`<name>.component.module.ts`), and the story
  (`<name>.component.stories.ts`).
- **Generate with**:
  `npx nx g @skyux-sdk/e2e-schematics:story <name> --project=<library>-storybook`

## Story Conventions

- The story's default export is a `Meta<T>` object with a stable `id`, a
  `title` of the form `Components/<DisplayName>`, the wrapper `component`, and
  a `moduleMetadata` decorator that imports the wrapper component's module.
- Export one or more named stories. Each is a plain object with a `render`
  function returning `{ props: args }` and an `args` object for the rendered
  inputs. Mirror an existing sibling story (e.g.
  `apps/e2e/avatar-storybook/src/app/avatar/avatar.component.stories.ts`).
- The wrapper component (`app-<name>`) is a thin, non-standalone host that
  embeds the real SKY UX component(s) and supplies demo data. Keep it minimal
  and focused on the visual state(s) under test.

## What to Capture

- Render the component in the meaningful visual states a reviewer needs to
  verify: default, key input permutations, and any state with distinct styling
  (selected, disabled, error, empty, loading). Add a separate named story or
  args permutation for each distinct visual state rather than cramming logic
  into one story.
- Do NOT add assertions or interaction logic here — visual tests capture
  rendered output; behavior is covered by component specs and harness specs.

## Verification

After adding or changing stories, build the storybook app to confirm it
compiles, then lint and format:

```bash
npx nx build <library>-storybook
npm run lint:affected
nx format --files=<changed-file-paths>
```
