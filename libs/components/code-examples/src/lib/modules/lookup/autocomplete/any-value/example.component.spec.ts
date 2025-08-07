import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupAutocompleteAnyValueExampleComponent } from './example.component';
import { LookupAutocompleteAnyValueExampleService } from './example.service';

describe('Autocomplete with any value example', () => {
  let mockSvc!: jasmine.SpyObj<LookupAutocompleteAnyValueExampleService>;

  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyAutocompleteHarness;
    fixture: ComponentFixture<LookupAutocompleteAnyValueExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupAutocompleteAnyValueExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyAutocompleteHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<LookupAutocompleteAnyValueExampleService>(
      'LookupAutocompleteAnyValueExampleService',
      ['search'],
    );

    TestBed.configureTestingModule({
      imports: [LookupAutocompleteAnyValueExampleComponent],
      providers: [
        {
          provide: LookupAutocompleteAnyValueExampleService,
          useValue: mockSvc,
        },
      ],
    });
  });

  it('should set up favorite color autocomplete input', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    mockSvc.search.and.callFake((searchText) =>
      of({
        hasMore: false,
        colors:
          searchText === 'b'
            ? [
                {
                  id: 1,
                  name: 'Blue',
                },
              ]
            : [],
        totalCount: 1,
      }),
    );

    const ctrl = await harness.getControl();

    await ctrl.focus();
    await ctrl.setValue('b');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText[0]).toBe('b');
    expect(searchResultsText[1]).toBe('Blue');

    await ctrl.clear();
    await ctrl.setValue('Turquoise');

    const searchResults = await harness.getSearchResults();
    await expectAsync(searchResults[0].getDescriptorValue()).toBeResolvedTo(
      'Turquoise',
    );
    await expectAsync(searchResults[0].getText()).toBeResolvedTo('Turquoise');

    await searchResults[0].select();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
        '.selected-color',
      )?.innerText,
    ).toBe('Turquoise');
  });
});
