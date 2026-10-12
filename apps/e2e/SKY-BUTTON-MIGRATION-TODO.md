# TODO: `sky-btn` buttons not yet migrated to `<sky-button>`

The `migrate-sky-btn-to-sky-button` skill
([.github/skills/migrate-sky-btn-to-sky-button/SKILL.md](../../.github/skills/migrate-sky-btn-to-sky-button/SKILL.md))
was run over `apps/e2e`. It migrated 93 buttons and left the ones below as
native `<button class="sky-btn ...">` elements. Each needs a decision or a
library change before it can move.

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

### Pages shared links (1 button)

`pages-storybook/src/app/shared/links/links.component.html` uses
`class="sky-btn-link-inline"` **without** `sky-btn`. It is a bare inline link
style, and `sky-button` always adds `sky-btn`, which changes the styling.

**To do:** check how this button looks next to `<sky-button buttonStyle="link-inline">`.
Migrate if the two match, otherwise leave it.

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

## Also verify after migration

Not a leftover, but these rely on the migration and can only be confirmed by
running the e2e suites (nothing was run when the migration was done):

- Cypress selectors that now match the `<sky-button>` host instead of the inner
  button: `.open-wizard-btn`, `.open-*-modal-btn`, `.open-ok-confirm-btn`,
  `.open-custom-confirm-btn`, `#custom-trigger`, `#show-tabs-button`,
  `#open-*-modal-button`.
- Percy snapshots for the migrated stories, in particular toolbar (the icon
  margin workaround was removed from "Button 0"), inline delete, repeater and
  inline form (labels were invented as "Delete" and "Edit").
