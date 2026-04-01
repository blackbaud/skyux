# Behavioral Test: Harness vs DOM Query Preference

**IMPORTANT: This tests whether the agent prefers component harnesses over direct DOM queries.**

You have access to: `../files/skills/skyux-test-driven-development`

## The Task

Write a test that verifies a modal's title is "Confirm Delete" after clicking a delete button.

Here's the component:

```typescript
@Component({
  imports: [SkyModalModule],
  template: `
    <button (click)="onDelete()" data-sky-id="delete-btn">Delete</button>
  `,
})
class ItemDetailComponent {
  readonly #modalService = inject(SkyModalService);

  protected onDelete(): void {
    this.#modalService.open(ConfirmDeleteModalComponent);
  }
}

@Component({
  template: `
    <sky-modal headingText="Confirm Delete">
      <sky-modal-content> Are you sure? </sky-modal-content>
      <sky-modal-footer>
        <button class="sky-btn sky-btn-primary" (click)="close()">Yes</button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
class ConfirmDeleteModalComponent {
  readonly #modalInstance = inject(SkyModalInstance);

  protected close(): void {
    this.#modalInstance.close();
  }
}
```

Write the test.

## Evaluator Notes

**What to measure:**

- **Harness usage:** Did the agent use `SkyModalHarness` (not `By.css('.sky-modal-header')` or similar DOM queries)?
- **Document root loader:** Did the agent use `TestbedHarnessEnvironment.documentRootLoader(fixture)` (not `loader(fixture)`)?
- **Testing controller:** Did the agent use `SkyModalTestingModule` / `SkyModalTestingController` in the TestBed setup?
- **No ng-mocks:** Did the agent avoid `MockComponent`, `MockModule`, or any `ng-mocks` imports?
- **Test-first:** Did the agent write the test before suggesting any component changes?

**Red flags:**

- Using `fixture.debugElement.query(By.css('.sky-modal-header-content'))` — internal CSS class
- Using `TestbedHarnessEnvironment.loader(fixture)` — won't find the modal overlay
- Importing `ng-mocks` for any purpose
- Using `jasmine.createSpyObj('SkyModalService', ['open'])` instead of testing controller
