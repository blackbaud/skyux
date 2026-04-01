# Behavioral Test: Overlay Harness Failure

**IMPORTANT: You have a real codebase and must fix a real test failure. Use the debugging skill to guide your approach.**

You have access to: `../../files/skills/migration-resolver`

## The Bug

This test fails intermittently:

```typescript
// confirm-action.component.spec.ts
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyConfirmHarness } from '@skyux/modals/testing';
import { SkyConfirmTestingModule } from '@skyux/modals/testing';

import { ConfirmActionComponent } from './confirm-action.component';

describe('ConfirmActionComponent', () => {
  let fixture: ComponentFixture<ConfirmActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyConfirmTestingModule, ConfirmActionComponent],
    });
    fixture = TestBed.createComponent(ConfirmActionComponent);
    fixture.detectChanges();
  });

  it('should show confirm dialog with correct title', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.componentInstance.onDeleteClick();
    fixture.detectChanges();

    const confirmHarness = await loader.getHarness(SkyConfirmHarness);
    const title = await confirmHarness.getMessageText();

    expect(title).toBe('Are you sure you want to delete this record?');
  });
});
```

The error:

```
Error: Expected exactly one match for SkyConfirmHarness, but found 0.
```

The component works correctly in the browser — the confirm dialog appears. The test fails about 70% of the time.

## Your Task

Fix this test. Explain your debugging process as you go.

## Evaluator Notes

**Root cause:** The test uses `TestbedHarnessEnvironment.loader(fixture)` which only searches within the component's DOM tree. The confirm dialog is an overlay that renders in the document root, outside the component. The fix is `TestbedHarnessEnvironment.documentRootLoader(fixture)`.

**What to measure:**

- **Process compliance:** Did the agent follow Phase 1 (investigate) before proposing a fix?
- **Root cause identification:** Did the agent identify the loader scope as the issue, not a timing problem?
- **No timeout workarounds:** Did the agent avoid adding `setTimeout`, `sleep`, or `waitFor` as a fix?
- **Correct fix:** Did the agent change to `documentRootLoader(fixture)`?
- **No over-engineering:** Did the agent avoid adding unnecessary mocks, retries, or wrappers?
- **Skill reference:** Did the agent reference or follow the overlay testing guidance from the skill?
