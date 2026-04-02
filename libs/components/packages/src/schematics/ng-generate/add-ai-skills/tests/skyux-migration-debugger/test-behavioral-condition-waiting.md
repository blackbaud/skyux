# Behavioral Test: Flaky Timeout in Test

**IMPORTANT: You have a real codebase and must fix a flaky test. Use the debugging skill and its references to guide your approach.**

You have access to: `../../files/skills/skyux-migration-debugger` (including `references/condition-based-waiting.md`)

## The Bug

This test passes locally but fails ~40% of the time in CI:

```typescript
// autocomplete-search.component.spec.ts
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { AutocompleteSearchComponent } from './autocomplete-search.component';

describe('AutocompleteSearchComponent', () => {
  let fixture: ComponentFixture<AutocompleteSearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutocompleteSearchComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(AutocompleteSearchComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should show search results after typing', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const autocomplete = await loader.getHarness(SkyAutocompleteHarness);

    await autocomplete.enterText('Ang');

    // Wait for debounce
    await new Promise((r) => setTimeout(r, 350));

    httpMock
      .expectOne('/api/search?q=Ang')
      .flush([{ name: 'Angular' }, { name: 'AngularJS' }]);

    // Wait for results to render
    await new Promise((r) => setTimeout(r, 100));

    fixture.detectChanges();

    const results = await autocomplete.getSearchResults();
    expect(results.length).toBe(2);
  });
});
```

The CI error (intermittent):

```terminaloutput
Error: Expected 0 to be 2.
    at <Jasmine>
    at UserContext.<anonymous> (autocomplete-search.component.spec.ts:42:32)
```

Sometimes the results array is empty, sometimes it has items. Adding longer `setTimeout` delays makes it pass more often but never 100%.

## Your Task

Fix this flaky test. Make it reliable in all environments. Explain your debugging process as you go.

## Evaluator Notes

**Root cause:** The test uses two arbitrary `setTimeout` delays (350ms for debounce, 100ms for rendering). These race against real timers in CI where CPU scheduling is unpredictable.

**Correct fix:** Replace with `fakeAsync`/`tick` to control timing deterministically:

```typescript
it('should show search results after typing', fakeAsync(async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const autocomplete = await loader.getHarness(SkyAutocompleteHarness);

  await autocomplete.enterText('Ang');

  tick(300); // Advance past debounce

  httpMock
    .expectOne('/api/search?q=Ang')
    .flush([{ name: 'Angular' }, { name: 'AngularJS' }]);

  tick();
  fixture.detectChanges();

  const results = await autocomplete.getSearchResults();
  expect(results.length).toBe(2);
}));
```

**What to measure:**

- **Reference consultation:** Did the agent read or reference `condition-based-waiting.md`?
- **Root cause identification:** Did the agent identify `setTimeout` as the flaky culprit, not a rendering or data issue?
- **Angular-native pattern:** Did the agent use `fakeAsync`/`tick` (the Angular-native approach) rather than the generic `waitFor()` polling function?
- **No increased timeouts:** Did the agent avoid "fixing" by increasing the `setTimeout` delays?
- **Process compliance:** Did the agent investigate before proposing a fix?
- **Skill reference:** Did the agent reference the anti-pattern table in the debugging skill (`setTimeout`/`sleep` in tests)?
