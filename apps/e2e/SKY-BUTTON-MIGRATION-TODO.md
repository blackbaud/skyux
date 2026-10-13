# TODO: `sky-btn` buttons not yet migrated to `<sky-button>`

The `migrate-sky-btn-to-sky-button` skill
([.github/skills/migrate-sky-btn-to-sky-button/SKILL.md](../../.github/skills/migrate-sky-btn-to-sky-button/SKILL.md))
was run over `apps/e2e`. The buttons below remain as native
`<button class="sky-btn ...">` elements. Each needs a decision or a library
change before it can move, or is intentionally left as-is.

Re-run `grep -rn "sky-btn" apps/e2e --include="*.html" --include="*.ts"` to
check what is left. Delete an entry here when its buttons are migrated.

## Blocked on a library change

### Input box buttons (10 buttons)

`libs/components/forms/src/lib/modules/input-box/input-box.component.scss`
styles `.sky-btn` inside `.sky-input-group-btn` and `.sky-input-box-btn-inset`
(padding, border radius, margins, first and last child rules). I did not check
whether those rules still apply, or win over `sky-button`'s own icon-only
padding rule, once the button is wrapped.

- `forms-storybook/src/app/input-box/input-box.component.html` (10)

Two further problems:

- 8 of the 10 use `<sky-icon iconSize="l" />`. `sky-button` has no icon size input.
- All 10 are icon-only with no `aria-label` or `title`, so each needs a label
  chosen (for example "Open calendar", "Search").

**To do:** decide whether `sky-button` needs an icon size input, or whether
these should stay native. If they migrate, verify the input-group styling and
snapshots, and add the labels.

## Needs a decision, not a library change

### Dropdown custom trigger (1 button)

`popovers-storybook/src/app/dropdown/dropdown.component.html` (`.custom-trigger`).
It carries `skyDropdownTrigger` on the button and wraps an icon, text and a
second icon in a `<div>`. `sky-button` supports one icon and a label only.

**To do:** likely stays native, since it exists to demonstrate a custom trigger.
Confirm and delete this entry. Cypress targets `.custom-trigger` in
`popovers-storybook-e2e`.

## Intentionally not migrated

### Theme buttons story (about 56 `sky-btn` occurrences)

`theme-storybook/src/app/buttons/buttons.component.html` is the visual test for
the `sky-btn` CSS classes. It covers classes with no `sky-button` equivalent
(`sky-btn-sm`, `sky-btn-borderless`, `sky-btn-borderless-inline`,
`sky-btn-icon-borderless-on_prominent`, and others) and exists so the theme
styles are snapshotted directly.

**To do:** keep as-is while the classes are public. Consider adding a separate
story for `<sky-button>` instead. The `forms-storybook` button story already
exists.

## Mixed native and `sky-button` coverage

**Status: proposal, not a decision.** Nothing in this section has been agreed
or implemented. It records an idea to discuss with the team. The team may
decide to test only one button type per story, or to skip this entirely.

**Why this is here.** As the library adopts `<sky-button>`, the storybook apps
are being migrated from native `<button class="sky-btn ...">` to it. Migrating
every button replaces the native HTML/CSS buttons in the visual tests, so a
later change that breaks them (for example to `.sky-btn` rules that components
such as the page header, toolbar or modal footer rely on) would no longer fail
a Percy snapshot. Keeping a mix of both in the stories where the button is part
of the component under test would keep that coverage. The cost is more
variation inside a story, some snapshot diffs against `main` (see below), and
possibly SCSS changes to support mixed neighbors.

**If the team decides against it,** delete this section. The only follow-up
worth keeping is the `modal-basic` entry, because that story lost its only
native footer button during the migration.

Many stories use buttons only so Cypress can set up component state. Others
have buttons that are integral to the component under test, because the
component's own SCSS selects `.sky-btn*` or the button's position. For those,
the stories should contain a mix of native `<button class="sky-btn ...">`
elements and `<sky-button>` so a future `sky-button` change cannot regress the
native HTML/CSS buttons.

The predictions below come from reading the diffs and SCSS. Nothing was
rendered, so confirm with Percy in both themes. Percy compares against the
`main` baseline, where every one of these buttons was native. Reverting a
button to its original native markup should restore the original pixels.

Not integral, leave as `<sky-button>`: dock, date range picker, datepicker,
checkbox, confirm and modal openers, toast triggers, sectioned form and wizard
openers, icon story buttons, and the error story's "Try again".

### Should not change the screenshot

Revert one or more buttons to their original native markup (see `git diff main`
for the original).

- **Page header actions** (`pages-storybook` `blocks-page`, `tabs-page`,
  `blocks-tile-dashboard-page`, `tabs-tile-dashboard-page`). The selector
  `> :is(.sky-btn, sky-button, sky-dropdown)` styles each direct child, so
  mixing should not change margins.
  - `blocks-page`: make "Action one" and "Action six" native.
  - `tabs-page` and the two tile dashboard pages: make "Action one" native.
  - `tabs-fit-layout` and `vertical-tabs-fit-layout` have one button each, so
    leave them as `sky-button`.
- **Toolbar** (`layout-storybook`): make "Button 1" and the second sort icon
  button native (original is `sky-btn sky-btn-default sky-btn-icon` with a
  `title`). Leave the disabled buttons as `sky-button`; the theme story
  already snapshots native disabled styles.
- **Toast and alert** (`toast-custom.component.html`, `alert.component.html`):
  make one `sky-btn-link` and one `sky-btn-link-inline` native in each. The
  toast and modern alert SCSS restyle both classes for coloured backgrounds,
  including hover and active.
- **Inline delete** (`layout-storybook`): keep "triggered" as `sky-button`, make
  "pending" a native `sky-btn sky-btn-danger` icon button.
- **Repeater** (`lists-storybook`): make one item's edit button a native
  `sky-btn-icon-borderless` (original had `aria-label="Edit"`). The repeater
  item SCSS has a `.sky-btn-icon-borderless` rule.
- **Inline form** (`inline-form-storybook`): make the edit button native in one
  row. The migration invented the "Edit" label; the original had none.
- **Card** (`layout-storybook`): make one card's "Action" native.
- **Modal basic** (`modals-storybook` `modal-basic.component.html`): the `@else`
  branch was the only native footer button and the migration made it a
  `sky-button`. Restore it to
  `<button class="sky-btn sky-btn-link" data-sky-id="close-button" type="button">`.
  The `useSkyButton` branch keeps covering `sky-button + sky-button`.

### Likely to change the screenshot

- **Mixed pairs in modal footers.** `modal-footer.component.scss` has margin
  rules for `.sky-btn + .sky-btn`, `sky-button + sky-button` and
  `.sky-btn + .sky-btn-link`, but none for a native button next to a
  `sky-button` in either order.
  - `tabs-storybook` `sectioned-form-modal`: a native Cancel after a
    `sky-button` Save would lose its gap.
  - A new variant with a native Save before a `sky-button` Close would too.
  - This is probably a library gap the mixed test would expose. Decide whether
    to fix the SCSS or accept the new baseline.
- **Net-new content** diffs by definition, but these are new baselines, not
  regressions:
  - a second card with a native `sky-btn-default` (low priority);
  - a native `<a class="sky-btn sky-btn-default">` in the action hub next to
    the permalink `sky-button`s (low priority, no `.sky-btn` CSS there);
  - a native button in the `sky-error-action` slot (cheap, no `.sky-btn` CSS);
  - a third modal footer variant, native Save plus `sky-button` Close.

### Not yet checked

- Toolbar item and inline form footer SCSS for rules that differ between native
  and `sky-button` neighbors.
- Whether the current `sky-button` versions already diff against `main`, for
  example the toolbar "Button 0" icon-margin workaround that was removed and the
  invented "Delete" and "Edit" labels. Reverting those to native would then fix
  a diff, not cause one.
- Other libraries whose SCSS styles `.sky-btn*` but had no migrated story
  audited: summary-action-bar, filter-button, text-editor-toolbar,
  needs-attention, split-view workspace footer, flyout iterator, colorpicker,
  timepicker and datepicker calendar, lookup search, phone-field, tokens,
  help-inline, selection-box, ag-grid header.
