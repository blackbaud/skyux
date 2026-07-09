# Bar Chart — Declarative Component API Plan

Status: **Implemented (MVP)**

This plan describes a declarative, child-component-driven API for the SKY UX
bar chart. The parent (`sky-chart-bar`) owns the Chart.js instance and assembles
the config; projected child components own the public data/config surface.

## Goals

- Replace the baked-in data/config in `sky-chart-bar` with data piped in via
  projected child components.
- Support **multiple series** and **multiple value axes** for MVP.
- Support **orientation** (`vertical` default, `horizontal`) for MVP.
- Keep the child components chart-type-agnostic so a future `sky-chart-line`
  reuses them unchanged.
- Avoid painting the API into a corner (additive-only growth within a major
  version).

## Non-goals (MVP)

- Multiple **category** axes (deferred; see "Future-proofing").
- Non-cartesian chart types (pie, doughnut, radar, polar area).
- Scatter/bubble (`{x, y}` numeric-numeric) — different axis model.
- Mixed chart types (bar + line overlay) — reserved as an additive series
  `type` input later.
- Input validation / required-input error handling (deferred).

## Component model

```
sky-chart-bar                      (owns Chart instance + assembly; inputs: orientation)
├─ sky-chart-axis-category (1)     labelText, labelHidden, categories[]
├─ sky-chart-axis-value (1..n)     labelText, labelHidden, axisId
└─ sky-chart-series (1..n)         labelText, values[], valueAxis (→ axisId)
```

- **Children own the public data API; the parent owns the assembled Chart.js
  config and lifecycle (internal).** No data inputs on the parent — that would
  create drift and ambiguous ownership.
- Category values are defined **once** on the category axis (Chart.js shares a
  single `labels` array across datasets in a bar chart).
- Each series supplies `values: number[]` aligned by index to the category
  axis `categories[]`.

## Proposed inputs

### `sky-chart-bar` (parent)

| Input         | Type                         | Default      | Maps to (Chart.js)                  |
| ------------- | ---------------------------- | ------------ | ----------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | `indexAxis` (`'x'` / `'y'`) + roles |

Responsibilities:

- Query children as **collections** (`contentChildren`), even the category axis.
- Assemble the Chart.js config, deriving axis roles from `orientation`.
- Own the Chart.js instance lifecycle: create once, `update()` on data/option
  changes, `destroy()` on teardown (no re-`new Chart()` per effect run).
- Feed the same assembled model to the accessible data-table modal so the
  canvas and table can't drift.

### `sky-chart-axis-category` (exactly one for MVP)

| Input         | Type        | Default    | Maps to (Chart.js)                         |
| ------------- | ----------- | ---------- | ------------------------------------------ |
| `labelText`   | `string`    | (required) | index scale `title.text`                   |
| `labelHidden` | `boolean`   | `false`    | index scale `title.display`                |
| `categories`  | `unknown[]` | (required) | `data.labels` (shared across all datasets) |

### `sky-chart-axis-value` (one or more for MVP)

| Input         | Type      | Default       | Maps to (Chart.js)                   |
| ------------- | --------- | ------------- | ------------------------------------ |
| `labelText`   | `string`  | (required)    | value scale `title.text`             |
| `labelHidden` | `boolean` | `false`       | value scale `title.display`          |
| `axisId`      | `string`  | primary/first | value scale key (`y`/`x` per orient) |

- `axisId` is optional when there is a single value axis; required when more
  than one so series can bind unambiguously.

### `sky-chart-series` (one or more for MVP)

| Input       | Type       | Default      | Maps to (Chart.js)                           |
| ----------- | ---------- | ------------ | -------------------------------------------- |
| `labelText` | `string`   | (required)   | `dataset.label`                              |
| `values`    | `number[]` | (required)   | `dataset.data` (index-aligned to categories) |
| `valueAxis` | `string`   | primary axis | `dataset.yAxisID` / `xAxisID` (per orient)   |

- **One series binds to exactly one value axis** (Chart.js datasets have a
  single `yAxisID`/`xAxisID`). `valueAxis` is a single id, not an array.
- Multiple value axes are consumed **across** series, not within one.

## Orientation mapping

The parent derives axis roles from `orientation`; nothing hardcodes
category→x / value→y.

| orientation          | `indexAxis` | category axis | value axis/axes |
| -------------------- | ----------- | ------------- | --------------- |
| `vertical` (default) | `x`         | x             | y (left/right)  |
| `horizontal`         | `y`         | y             | x (top/bottom)  |

The series→axis binding is orientation-agnostic in the public API (a series
names _which_ value axis); the parent resolves it to `yAxisID` vs `xAxisID`.

## Chart instance lifecycle

- Keep a reference to the Chart.js instance.
- `update()` when data/options change (preserves animation/state).
- `destroy()` on component teardown (`DestroyRef`).
- Never call `new Chart()` on every effect run (avoids the
  "Canvas is already in use" error and leaks).

## Accessibility

- The assembled data model feeds both the canvas and the existing
  `chart-data-table-modal` from a single source of truth.

## Future-proofing (deferred, additive-only)

- **Multiple category axes** (hierarchical labels): query the category axis as
  a collection now (`contentChildren`), keep the `axisId` pattern symmetric
  across axis types, and never expose a public type that assumes a single
  category axis. Adding a second instance + an optional `categoryAxis` series
  ref later is non-breaking.
- **Mixed charts** (bar + line): add an optional `type` input on
  `sky-chart-series` later — additive, keeps children shared.
- **`sky-chart-line`**: a new parent wrapper reusing the same three children.
- **Non-cartesian / scatter**: out of scope for these components; they warrant a
  separate composition (scatter uses two value axes and `{x, y}` series data,
  so the `category-axis` concept does not apply).

## Open decisions

1. `axisId` ergonomics: always required vs. optional-until-multiple.
   Leaning **optional-until-multiple** (friendlier single-axis case, needs a
   "default/primary axis" resolution rule in the parent).
2. Index-alignment safety: `values.length` must equal `categories.length`.
   Dev-time validation deferred, but noted as a likely follow-up.
