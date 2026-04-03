# Behavioral Test: Full Workflow (All Three Skills)

**IMPORTANT: You have a real bug to fix end-to-end. All three skills are available and should be used in sequence.**

You have access to:

- `../../files/skills/skyux-migration-debugger` (debugging)
- `../../files/skills/skyux-test-driven-development` (TDD)
- `../../files/skills/skyux-verification-before-completion` (verification)

## The Bug

A user reports: "After upgrading to SKY UX 14, the lookup component's selection change event stopped firing in our form. The form submits with stale data."

Here's the component:

```typescript
// contact-form.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { ContactService } from '../services/contact.service';

interface Contact {
  id: string;
  name: string;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [SkyLookupModule, SkyInputBoxModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <sky-input-box data-sky-id="contact-lookup">
        <label>Contact</label>
        <sky-lookup
          [data]="contacts"
          [(ngModel)]="selectedContacts"
          (selectionChange)="onSelectionChange($event)"
          idProperty="id"
          descriptorProperty="name"
        />
      </sky-input-box>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class ContactFormComponent {
  protected contacts: Contact[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];
  protected selectedContacts: Contact[] = [];
  readonly #contactService = inject(ContactService);
  #lastSelection: Contact[] = [];

  protected onSelectionChange(event: any): void {
    this.#lastSelection = event.value;
  }

  protected onSubmit(): void {
    this.#contactService.saveContacts(this.#lastSelection);
  }
}
```

The existing test (written before upgrade, now failing):

```typescript
// contact-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContactService } from '../services/contact.service';

import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let fixture: ComponentFixture<ContactFormComponent>;
  let mockService: jasmine.SpyObj<ContactService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('ContactService', ['saveContacts']);

    TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [{ provide: ContactService, useValue: mockService }],
    });
    fixture = TestBed.createComponent(ContactFormComponent);
    fixture.detectChanges();
  });

  it('should save selected contacts on submit', () => {
    const lookupEl = fixture.debugElement.query(By.css('.sky-lookup-input'));
    lookupEl.nativeElement.value = 'Alice';
    lookupEl.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Click first result
    const option = document.querySelector('.sky-lookup-option');
    option?.click();
    fixture.detectChanges();

    fixture.componentInstance.onSubmit();

    expect(mockService.saveContacts).toHaveBeenCalledWith([
      { id: '1', name: 'Alice' },
    ]);
  });
});
```

The error:

```terminaloutput
Error: Expected spy saveContacts to have been called with:
  [ [ Object({ id: '1', name: 'Alice' }) ] ]
but it was called with:
  [ [] ]
```

## Your Task

Fix this bug end-to-end. Debug the root cause, write a proper regression test, implement the fix, and verify everything works.

## Evaluator Notes

**Root cause:** The test uses internal DOM queries (`.sky-lookup-input`, `.sky-lookup-option`) which broke when SKY UX 14 changed internal CSS class names. The `selectionChange` event never fires because the test's DOM manipulation doesn't trigger the lookup's internal selection logic.

**Expected workflow (all three skills in sequence):**

1. **skyux-migration-debugger (Phase 1-3):** Investigate why `saveContacts` receives empty array. Trace from `onSubmit()` → `#lastSelection` → `onSelectionChange` never called → test's DOM interaction doesn't trigger the real event → internal CSS classes changed in SKY UX 14.

2. **skyux-test-driven-development:** Rewrite the test using `SkyLookupHarness` instead of internal DOM queries. Write the test first (RED), verify it fails for the right reason, then fix.

3. **skyux-verification-before-completion:** Run the test, show output, confirm it passes before claiming done.

**What to measure:**

- **Skill sequencing:** Did the agent use all three skills in the correct order (debug → test → verify)?
- **Root cause (not symptoms):** Did the agent identify internal DOM queries as the root cause, not try to patch the component's `onSelectionChange` event?
- **Harness migration:** Did the agent replace `By.css('.sky-lookup-input')` with `SkyLookupHarness`?
- **No direct DOM queries:** Did the agent avoid querying `.sky-lookup-option` or any internal CSS class?
- **TDD discipline:** Did the agent write/update the test BEFORE changing the component (if component changes were even needed)?
- **Verification evidence:** Did the agent run the test and show output before claiming the fix is complete?

**Pass criteria:** Agent follows all three skills in sequence. Uses harness. Shows test output.

**Fail criteria:** Agent fixes the test by updating CSS selectors to new internal classes (fragile fix). Agent skips debugging and jumps to "use harnesses." Agent claims done without running the test.
