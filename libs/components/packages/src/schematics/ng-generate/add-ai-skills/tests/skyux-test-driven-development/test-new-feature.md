# Behavioral Test: New Harness Feature with TDD

**IMPORTANT: You must implement this feature. Use the TDD skill to guide your approach.**

You have access to: `../../files/skills/skyux-test-driven-development`

## The Task

Add a `getErrorMessage()` method to `SkyInputBoxHarness` that returns the error text shown below an input box when validation fails.

Here's the existing harness (simplified):

```typescript
// input-box-harness.ts
import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInputBoxHarnessFilters } from './input-box-harness-filters';

export class SkyInputBoxHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-input-box';

  public static with(
    filters: SkyInputBoxHarnessFilters,
  ): HarnessPredicate<SkyInputBoxHarness> {
    return SkyInputBoxHarness.getDataSkyIdPredicate(filters);
  }

  public async getLabelText(): Promise<string> {
    const label = await this.locatorFor('.sky-input-box-label-wrapper')();
    return label.text();
  }

  public async getHintText(): Promise<string | undefined> {
    const hint = await this.locatorForOptional('.sky-input-box-hint-text')();
    return hint ? await hint.text() : undefined;
  }
}
```

Here's the test component you'll use:

```typescript
// test-component.ts
@Component({
  imports: [SkyInputBoxModule, FormsModule],
  template: `
    <sky-input-box data-sky-id="test-input" labelText="Email">
      <input type="email" [(ngModel)]="email" required #emailField="ngModel" />
      <sky-form-error errorName="required" errorText="Email is required" />
    </sky-input-box>
  `,
})
class TestComponent {
  protected email = '';
}
```

The `sky-form-error` component renders a `sky-status-indicator` with the class `.sky-form-error` when the parent `sky-form-errors` enables it. Errors can also be projected via `.sky-error-label` or `.sky-error-indicator` selectors.

## Your Task

Implement `getErrorMessage()` using TDD. Show your full process.

## Evaluator Notes

**What to measure:**

- **Test first:** Did the agent write a spec file with a failing test BEFORE adding `getErrorMessage()` to the harness?
- **Watch it fail:** Did the agent run the test and observe the failure (e.g., `getErrorMessage is not a function`)?
- **Harness pattern:** Did the agent use a locator targeting the actual error rendering (e.g., `locatorForOptional('.sky-form-error')`, `locatorForOptional('.sky-error-label')`, or `locatorForOptional('.sky-error-indicator')`) in the implementation?
- **Minimal code:** Did the agent write only what's needed to pass the test, without adding extra features?
- **Red-green-refactor:** Did the agent follow the full cycle — red, verify, green, verify?
- **Setup pattern:** Did the agent use `setupTest()` with `TestbedHarnessEnvironment.loader(fixture)` and `SkyInputBoxHarness.with({ dataSkyId: ... })`?
