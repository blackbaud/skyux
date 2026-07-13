# Charts library review plan

Status: the charts library is in **preview** (`@preview`), so breaking changes
are acceptable. This plan captures the findings from an API-flexibility and
accessibility review and proposes a concrete fix for each item.

Goals driving the review:

1. The public API must stay flexible so **line** and **donut** chart types can
   be added soon without breaking changes.
2. `sky-chart` / `sky-chart-bar` must be accessible.

---

## Part 1 — API flexibility for line and donut charts

The cartesian foundation is well-factored and line charts will drop in cleanly.
Donut is the real stress test because it is **not** cartesian (no category/value
axes — it has slices with values). The items below remove the coupling points
that would otherwise force breaking changes when donut lands.

### 1.1 (Done) The wrapper is hardcoded to bar charts

- **Where:** [`src/lib/chart/chart.html`](src/lib/chart/chart.html) —
  previously `<ng-content select="sky-chart-bar" />`.
- **Problem:** The `sky-chart` wrapper projected only `sky-chart-bar`. Every new
  chart type (`sky-chart-line`, `sky-chart-donut`, …) required editing the
  wrapper, and the wrapper had no single type to reason about for the data-table
  bridge.
- **Implemented fix:**
  - Added an abstract `SkyChartPlot` base directive
    ([`src/lib/chart-plot/chart-plot.ts`](src/lib/chart-plot/chart-plot.ts),
    `@internal`) that owns the accessible-data-table bridge lifecycle
    (`SkyChartTableService` injection, the `afterRenderEffect` publish, and the
    `onDestroy` clear). Subclasses implement `buildTable()`.
  - `SkyChartBar` now `extends SkyChartPlot` and only implements `buildTable()`
    plus its bar-specific config.
  - The wrapper projects with a **catch-all** `<ng-content />` so any plot the
    consumer nests is projected with no wrapper edit per type.
- **Key learning (why not a marker class):** `ng-content select` matches the
  element **as authored in the consumer template**, not classes/attributes
  applied at runtime via a component's `host` binding. A `sky-chart-plot` marker
  class set on the plot component is therefore never matched by
  `select=".sky-chart-plot"`. Catch-all projection is the reliable way to get
  zero wrapper edits.
- **Trade-off:** Catch-all drops the previous "ignore stray, non-plot content"
  guard (the wrapper renders its own header/controls, so only consumer-nested
  content lands in the figure). The figure's accessible name comes from
  `aria-label`, so stray content does not corrupt it. The obsolete
  "should not project content other than sky-chart-bar" test was removed.
- **Result:** Adding line/donut is additive — no wrapper edits, and each new
  plot inherits the table bridge by extending `SkyChartPlot`.

### 1.2 Value formatting is coupled to the value axis

- **Where:** [`src/lib/axis/chart-axis-value.ts`](src/lib/axis/chart-axis-value.ts)
  — `format`, `currencyCode`, and `digits` inputs live on
  `sky-chart-axis-value`.
- **Concern:** A donut has no value axis, so it was unclear where value-format
  configuration would live for a non-cartesian chart type. The MVP release ships
  the bar chart only; the goal is to confirm the existing bar API will not need
  a breaking change when donut is added later.

#### Decision

- **Donut authoring shape: Option B** — dedicated `sky-chart-slice` children with
  the value-format inputs on `sky-chart-donut`. These components are **not built
  now**; this is the target shape the current API must stay compatible with.

  ```html
  <sky-chart headingText="Revenue by region">
    <sky-chart-donut format="currency" currencyCode="USD" labelText="Revenue">
      <sky-chart-slice labelText="North" [value]="100" />
      <sky-chart-slice labelText="South" [value]="200" />
    </sky-chart-donut>
  </sky-chart>
  ```

#### Impact on the current bar chart API: none required

- The `format` / `currencyCode` / `digits` inputs on `sky-chart-axis-value` are
  the **correct** home for cartesian charts — the value axis owns tick-label
  formatting, and every series bound to an axis shares that format. Keep them
  where they are.
- Because donut gets its **own** format home on `sky-chart-donut` (Option B), it
  does not need to borrow from or repurpose `sky-chart-axis-value` /
  `sky-chart-axis-category`. No existing input moves, changes type, or is
  removed, so there is no breaking change to defer.
- `SkyChartSeries.valueAxis` is likewise cartesian-only and is simply not used by
  donut (which uses `sky-chart-slice`), so it needs no change.

#### What keeps this flexible (verify, mostly already true)

- The formatting **logic and type are already host-agnostic** and reusable:
  [`createSkyChartValueFormatter`](src/lib/shared/value-formatter.ts) and the
  publicly exported [`SkyChartValueFormat`](src/lib/shared/value-format.ts)
  string union (`'currency' | 'number' | 'percent'`). Keep both public and
  host-neutral so donut consumes them unchanged.
- The `SkyChartValueFormat` name is generic ("value format"), not axis-specific,
  so it reads correctly on a donut too — no rename needed.

#### Deferred until donut is actually built (do not do now — YAGNI)

- Add `format` / `currencyCode` / `digits` inputs to `sky-chart-donut`
  (and, if useful, `sky-chart-slice`), reusing the same type and formatter.
- Only if that duplication proves worth removing once a **second** consumer
  exists, extract the three inputs into a small shared value-format input
  directive that both `sky-chart-axis-value` and `sky-chart-donut` apply. Do not
  extract it preemptively while the axis is the sole consumer.

- **Result:** The bar-only MVP ships unchanged, and adding donut later is purely
  additive (new `sky-chart-donut` / `sky-chart-slice` components) with no
  breaking change to the existing public API.

### 1.3 The accessible-table model is cartesian-shaped

- **Where:** [`src/lib/chart-table/chart-table.ts`](src/lib/chart-table/chart-table.ts)
  — `SkyChartTable` is `categoryLabel` / `categories[]` / `series[]`.
- **Problem:** Donut data is really label + value pairs, not a category axis
  crossed with multiple series. The table is the one place **all** chart types
  converge for the accessible data view, so its shape must represent
  non-cartesian data too.
- **Suggested fix:** This interface is `@internal`, so it can change freely.
  Generalize the model (or add a donut-specific builder that produces the same
  `SkyChartTable` contract) so a single-series label/value chart renders a
  sensible table. Design this alongside item 1.1's shared plot base so each plot
  type is responsible for building its own table representation.
- **Result:** The data-table modal works for every chart type without special
  casing.

### 1.4 Keep (no change needed)

These are already right and should be preserved:

- Type-specific plot selectors (`sky-chart-bar` → `sky-chart-line` /
  `sky-chart-donut`).
- Per-chart `SkyChartTableService` instance provided at the `sky-chart` level.
- Shared cartesian helpers in
  [`src/lib/shared/cartesian-utils.ts`](src/lib/shared/cartesian-utils.ts)
  (already typed `SkyCartesianChartType = 'bar' | 'line'`).
- Keeping `SkyChartBarOrientation` bar-scoped rather than a global enum.

---

## Part 2 — Accessibility of `sky-chart` / `sky-chart-bar`

The core pattern is sound: the canvas is `aria-hidden="true"` (correct — canvas
content is not exposable to assistive technology), and the real accessible path
is the data-table modal, which already uses proper table semantics
(`<caption>`, `scope="col"`, `scope="row"`, `th` / `td`). The items below close
the remaining gaps before promoting out of preview.

### 2.1 (Closed — no change) Figure labeling when the heading is visible

- **Where:** [`src/lib/chart/chart.html`](src/lib/chart/chart.html)
  (`[attr.aria-label]="figureLabel()"`) and
  [`src/lib/chart/chart.ts`](src/lib/chart/chart.ts) (`figureLabel`).
- **Original concern:** When the heading is visible, `figureLabel` returns
  `null`, so the `<figure>` has no `aria-label`. This looked like a gap (an
  unnamed figure).
- **Investigation / decision:** Naming the figure with the heading text in this
  case is a **regression**, not a fix: the heading (`<h3>`) and the figure are
  siblings, so an `aria-label` (or `aria-labelledby`) that echoes the heading is
  announced twice — once as the heading, once on entering the figure — in close
  succession. `aria-labelledby` does **not** avoid this; it only changes the
  name's provenance. The existing conditional is deliberate and correct: when
  the heading is visible it provides context, so the figure is left unnamed to
  avoid redundancy; when the heading is **hidden**, `figureLabel` names the
  figure so the title is not lost. That behavior is kept as-is.
- **Result:** No code change. Programmatic identity for the figure when the
  heading is visible is handled in **2.2** with a _descriptive_ accessible name
  (chart type / shape / "data table available") that adds information rather than
  repeating the title.

### 2.2 (Done) The accessible data has no text alternative and is hard to discover

- **Where:** data reachable only via "View data table" in
  [`src/lib/chart/chart-controls.html`](src/lib/chart/chart-controls.html);
  canvas hidden in
  [`src/lib/shared/chart-js.ts`](src/lib/shared/chart-js.ts).
- **Problem:** Because the canvas is hidden, the only route to the data was
  opening the data-table modal from a context-menu dropdown. There was no
  on-figure summary and no hint that a table alternative exists, so the data was
  effectively buried for assistive-technology users.
- **Implemented fix:**
  - Each plot publishes a localized, descriptive `SkyChartAccessibleSummary`
    (`{ resourceKey, args }`) to `SkyChartTableService` alongside its table, via
    a new `buildSummary()` abstract on
    [`SkyChartPlot`](src/lib/shared/chart-plot.ts). `SkyChartBar` supplies the
    `skyux_charts.chart.bar.accessible_summary` key with its series and category
    counts, so the wording can describe that type's shape (line/donut can supply
    their own keys later — additive, no breaking change).
  - `SkyChart` resolves that key to localized text and uses it as the figure's
    accessible name. The `<figure>` gets `role="img"` **only when it has a
    name**, and the name is _descriptive_ (chart type, series/category counts,
    and "a data table is available from the chart's context menu") rather than
    echoing the heading — so it adds information without double-announcing the
    title (see 2.1). When the heading is hidden, the title is combined with the
    summary so it is not lost.
  - The summary sentence is sourced from a localized resource string
    (`resources_en_US.json` + the generated resources module).
- **Result:** AT users can perceive what the chart is (type and shape) and learn
  that a data-table alternative exists without hunting through the menu.

### 2.3 (Done) Series are distinguished by color alone in the rendered chart

- **Where:** dataset colors in
  [`src/lib/chart-bar/chart-bar.ts`](src/lib/chart-bar/chart-bar.ts)
  (categorical palette `backgroundColor`).
- **Problem:** Color is the only visual channel separating series. Legend and
  tooltip text mitigate this for sighted users, and the data table covers AT
  users, so it is borderline acceptable under WCAG 1.4.1 — but tooltips are
  canvas-rendered and therefore not keyboard/AT reachable.
- **Suggested fix:** Treat as a conscious decision rather than a required code
  change: keep the data table as the keyboard/AT-accessible view of individual
  data points, and document that reliance. Revisit non-color differentiation if
  future user testing surfaces a need. No blocking change required.
- **Implemented fix:** Documented the intentional color reliance in a code
  comment next to the categorical `backgroundColor` assignment in
  [`src/lib/chart-bar/chart-bar.ts`](src/lib/chart-bar/chart-bar.ts), pointing to
  the legend/tooltips for sighted users and the accessible data table (announced
  by the figure summary from 2.2) as the keyboard/AT fallback. No behavior
  change.
- **Result:** Color reliance is intentional and documented, with the table as
  the accessible fallback.

---

## Suggested sequencing

1. **2.1** — closed, no change: leaving the figure unnamed while the heading is
   visible is intentional (avoids double-announcing the title); figure identity
   is handled in 2.2.
2. **1.1** — done: `SkyChartPlot` base + catch-all projection; sets up 1.3.
3. **1.3** generalize the internal table model on top of the shared base.
4. **1.2** — decision only; no MVP code. Keep the value-format primitives
   public and host-neutral; add donut's format home when `sky-chart-donut` is
   built.
5. **2.2** — done: each plot publishes a localized descriptive summary that
   `sky-chart` uses as the figure's `role="img"` accessible name.
6. **2.3** — done: color-reliance decision documented in `chart-bar.ts`.

Each change must ship with tests (projects here enforce 100% coverage), pass
`npm run lint:affected`, and be formatted with `nx format --files=<paths>`.
