---
name: migrate-sky-btn-to-sky-button
description: 'Workflow for migrating HTML buttons that use the sky-btn CSS class to the sky-button component (SkyButton from @skyux/forms) in this Nx monorepo. Use when asked to "migrate buttons to sky-button", "replace sky-btn with the button component", or "convert button.sky-btn". Covers deciding which buttons can migrate, the class/attribute-to-input mapping, component imports, SCSS selector and layout impact, updating specs to SkyButtonHarness, and the test/lint/format gate.'
argument-hint: '<path or library> (e.g. libs/components/code-examples/src/lib/modules/modals)'
---

# Migrate `sky-btn` Buttons to `<sky-button>`

## When to Use

Historically, a SKY UX button is a native `<button>` (or `<a>`) with the
`sky-btn` CSS class plus a style modifier such as `sky-btn-primary`. The
`SkyButton` component (`<sky-button>`, `@skyux/forms`) renders that same
element with the same classes, so the look is unchanged. What the component adds
is a typed API: the label, icon, style, and disabled state are inputs instead
of hand-written markup and classes.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, scope discipline, and Conventional
Commits).

Scope the migration to what you were asked to do (a file, a library, a code
example). Do not migrate buttons elsewhere "while you're there".

## Before you start

- Read the current API in
  [button.ts](../../../libs/components/forms/src/lib/modules/button/button.ts)
  rather than relying on this file if the two ever disagree.
- Skim
  [button.component.html](../../../apps/e2e/forms-storybook/src/app/button/button.component.html)
  for every supported variant rendered side by side.
- Find candidates with `grep -rn "sky-btn" <path> --include="*.html" --include="*.ts"`.
  Inline templates and `.ts` string literals count.

## Decide whether the button can migrate

`<sky-button>` supports only the cases in the mapping tables below. **Leave the
button as-is** and report it in your summary when any of these apply:

- It uses a class with no `buttonStyle` equivalent: `sky-btn-sm`,
  `sky-btn-borderless`, `sky-btn-borderless-inline`,
  `sky-btn-icon-borderless-on_prominent`, `sky-btn-tab*`,
  `sky-btn-colorpicker-*`, or any one-off class used for bespoke styling.
- It has both inner text and an `aria-label` whose values differ (for example
  `<button aria-label="Delete Jane">Delete</button>`). `<sky-button>` has one
  label, so it cannot reproduce a different accessible name. Flag it in your
  summary with the file, the inner text, and the `aria-label`. If either value is
  bound (`[aria-label]`, `{{ }}`) and you cannot tell that they are equal, treat
  them as differing.
- It has projected content other than a label and one icon (for example a badge,
  a second icon, or markup inside the label).
- A directive or attribute must sit on the inner `<button>` itself rather than on
  the host element. A directive that works from the host element (for example a
  popover or dropdown trigger) can sit on `<sky-button>`, but verify that it
  still behaves in a spec or story. If you cannot, leave the button alone.
- The button is part of a library component's own template and the surrounding
  SCSS targets it with `.sky-btn` selectors (see "Layout and CSS selectors").
- The element is not a `<button>` or an `<a>` (for example `<div class="sky-btn">`).

## Mapping

### Style classes to `buttonStyle`

| Old class                                | New                                                          |
| ---------------------------------------- | ------------------------------------------------------------ |
| `sky-btn-default`                        | omit `buttonStyle` (`'default'` is the default)              |
| `sky-btn-primary`                        | `buttonStyle="primary"`                                      |
| `sky-btn-danger`                         | `buttonStyle="danger"`                                       |
| `sky-btn-link`                           | `buttonStyle="link"`                                         |
| `sky-btn-link-inline`                    | `buttonStyle="link-inline"`                                  |
| `sky-btn-icon-borderless`                | `buttonStyle="icon-borderless"` and `labelHidden` (see icon) |
| `sky-btn-icon`                           | `labelHidden` and `iconName` (see icon-only buttons below)   |
| `sky-btn-block`                          | `block`                                                      |
| `sky-btn-block-logo` (on a `<sky-icon>`) | `logo` on the `<sky-button>`                                 |

The `sky-btn` class itself is dropped. The component adds it.

### Attributes and content to inputs

| Old                                                   | New                                           |
| ----------------------------------------------------- | --------------------------------------------- |
| Text content: `Save`                                  | `labelText="Save"`                            |
| Interpolated text: `{{ label }}`                      | `[labelText]="label"`                         |
| `type="button"`                                       | omit (the default)                            |
| `type="submit"` / `type="reset"`                      | `buttonType="submit"` / `buttonType="reset"`  |
| `disabled` / `[disabled]="x"`                         | `disabled` / `[disabled]="x"`                 |
| `(click)="fn()"`                                      | `(buttonClick)="fn()"`                        |
| `<sky-icon iconName="add" />` child                   | `iconName="add"`                              |
| `aria-label="..."` and no inner text                  | `labelText="..."` with `labelHidden`          |
| `aria-label="x"` and the same inner text `x`          | `labelText="x"` (no `labelHidden`)            |
| `title="..."` on an icon-only button, no `aria-label` | `labelText="..."` with `labelHidden`          |
| `<a class="sky-btn ..." [href]="url">`                | `[permalink]="{ url }"`                       |
| `<a class="sky-btn ..." [routerLink]="cmds">`         | `[permalink]="{ route: { commands: cmds } }"` |
| `class="sky-theme-margin-right-xs"` (layout)          | keep, on `<sky-button>`                       |
| `data-sky-id="..."`                                   | keep, on `<sky-button>`                       |
| `@if` / `@for` around the button                      | keep, around `<sky-button>`                   |

Notes:

- Use `(buttonClick)`, not `(click)`. `buttonClick` is the component's output
  and emits a `PointerEvent` from the inner `<button>` or `<a>`.
- The `permalink` input accepts `route` or `url`. If both are set, `route` wins.
  A disabled button renders as a `<button>` rather than an anchor.
- `labelText` is required. Every migrated button needs a label, so an old icon-only
  button with no `aria-label` or `title` needs one invented. Derive it from the
  icon's meaning and the surrounding context, and mention it in your summary.
- Any other attribute on the old button (`title`, other `aria-*`, `id`, `name`, `form`,
  `autofocus`, `tabindex`, ...) has no input. If an attribute is purely
  descriptive (`title` that duplicates the label), drop it. If it carries
  behavior, apply the "leave as-is" rule above.

## Examples

**Basic**

```html
<!-- before -->
<button class="sky-btn sky-btn-primary" type="button" (click)="save()">
  Save
</button>

<!-- after -->
<sky-button buttonStyle="primary" labelText="Save" (buttonClick)="save()" />
```

**Submit button in a modal footer**

```html
<!-- before -->
<sky-modal-footer>
  <button class="sky-btn sky-btn-primary" type="submit">Save</button>
  <button class="sky-btn sky-btn-link" type="button" (click)="cancel()">
    Cancel
  </button>
</sky-modal-footer>

<!-- after -->
<sky-modal-footer>
  <sky-button buttonStyle="primary" buttonType="submit" labelText="Save" />
  <sky-button buttonStyle="link" labelText="Cancel" (buttonClick)="cancel()" />
</sky-modal-footer>
```

**Icon and label**

```html
<!-- before -->
<button class="sky-btn sky-btn-default" type="button" (click)="add()">
  <sky-icon iconName="add" />
  Add user
</button>

<!-- after -->
<sky-button iconName="add" labelText="Add user" (buttonClick)="add()" />
```

**Icon-only**

```html
<!-- before -->
<button
  class="sky-btn sky-btn-icon-borderless sky-theme-margin-right-xs"
  title="Delete user"
  type="button"
  (click)="delete()"
>
  <sky-icon iconName="delete" />
</button>

<!-- after -->
<sky-button
  buttonStyle="icon-borderless"
  class="sky-theme-margin-right-xs"
  iconName="delete"
  labelHidden
  labelText="Delete user"
  (buttonClick)="delete()"
/>
```

**Link**

```html
<!-- before -->
<a class="sky-btn sky-btn-default" href="https://example.com">Learn more</a>

<!-- after -->
<sky-button
  labelText="Learn more"
  [permalink]="{ url: 'https://example.com' }"
/>
```

## Component changes

- Add `SkyButton` (from `@skyux/forms`) to the `imports` array of every
  standalone component whose template now uses `<sky-button>`. There is no
  `SkyButtonModule`.
- If a component's template no longer uses `<sky-icon>` after the migration,
  remove `SkyIconModule` from its `imports`.
- Attribute order follows the repo's formatter and the existing templates:
  `buttonStyle`, other attributes alphabetically, then bound inputs, then
  outputs. Run `nx format` rather than ordering by hand.

## Layout and CSS selectors

`<sky-button>` is a host element (`display: inline-block`, or `block` for
`block`, or `inline` for `link-inline`) wrapping the real `<button>`. Anything
that assumed the `.sky-btn` element is a direct child or sibling can break:

- **Margins and spacing** go on `<sky-button>` (`class="sky-theme-margin-..."`),
  not on the inner element.
- **Selectors** such as `.parent > .sky-btn`, `.sky-btn + .sky-btn`, or
  `:first-child` now see `sky-button` instead. Search the owning component's
  SCSS and the library's SCSS for `.sky-btn` before migrating. Modal footers
  already handle `sky-button + sky-button`
  ([modal-footer.component.scss](../../../libs/components/modals/src/lib/modules/modal/modal-footer.component.scss)).
  Other containers may not. If you must change a library SCSS selector to
  support `sky-button`, add the sibling selector alongside the existing one,
  as the modal footer does. Do not replace it, because projected native
  `.sky-btn` buttons still need to work.
- **Flex and grid parents** treat `<sky-button>` as the item. Check that the
  button still stretches or aligns the same way as before.

## Update the tests

A migrated template needs its specs checked. This applies to the spec next to the
component, to code-example specs, and to any Cypress/Storybook spec in `apps/e2e`.

- **Use `SkyButtonHarness` for every migrated button, in library specs and
  code-example specs alike.** Newer specs use harnesses; older ones query the
  DOM, but do not copy the older style. Give the `<sky-button>` a `data-sky-id`
  and find it with `SkyButtonHarness.with({ dataSkyId })` from
  `@skyux/forms/testing`. The harness exposes `click()`, `isDisabled()`,
  `getLabelText()`, `getButtonStyle()`, `getIconName()`, `getLink()`, and more. See
  [button-harness.ts](../../../libs/components/forms/testing/src/modules/button/button-harness.ts).
- Replace every spec query, click, and assertion that targets a migrated button
  (`button`, `a`, `.sky-btn`, `querySelector`, `By.css`, `.click()`,
  `.textContent`, `.disabled`) with the harness equivalent. Load the harness
  with `TestbedHarnessEnvironment.loader(fixture)` (or `documentRootLoader` for
  buttons rendered in a modal or other overlay), and `await fixture.whenStable()`
  before querying.
- Specs that only look at buttons you left as-is do not change.
- If importing `@skyux/forms/testing` into a library spec fails lint (an Nx
  module-boundary or circular-dependency error), do not work around it. Keep that
  spec's DOM queries, and report the spec and the lint error in your summary.
- Follow
  [component-unit-testing.instructions.md](../../instructions/component-unit-testing.instructions.md)
  for library specs and
  [component-code-examples.instructions.md](../../instructions/component-code-examples.instructions.md)
  for code-example specs. Do not add new tests just to re-test `SkyButton`; its
  own spec covers it. Add a test only when a migrated button has behavior your
  change touched (for example the click handler moved to `(buttonClick)`).

## Code examples and docs

If the migrated button lives in a code example under
`libs/components/code-examples/`, the example is consumer-facing documentation:

- The example's `@title` and `documentation.json` entry do not change.
- Update the docs only if the example text names the old markup.
- Do not regenerate `routes/src/index.ts` unless you added or removed an
  example, which a migration should not.

## Verify

1. `npx nx test <project> --configuration=ci` for each affected project, then
   `npm run test:affected --configuration=ci`.
2. `npm run lint:affected`. Pay attention to unused imports and template
   lint errors.
3. Visual check where practical: `npx nx serve playground`, or the project's
   Storybook app under `apps/e2e/*-storybook`. The rendered output should be
   identical in both themes (default and modern).
4. `nx format --files=<changed-paths>`.
5. Confirm with `git diff` that no file outside the requested scope changed, and
   re-grep: every remaining `sky-btn` in scope should be one you deliberately
   left, and each of those should be named in your summary with the reason.

## Commit message

Use a `refactor` type with the owning library as scope, for example
`refactor(components/modals): use sky-button in the confirm dialog`. Do not use
`feat` or `fix` unless the change alters behavior. Follow
[commit-message.instructions.md](../../instructions/commit-message.instructions.md).
