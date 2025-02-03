import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupMultiSelectExampleComponent } from './example.component';
import { DemoService } from './example.service';

describe('Lookup multi-select example', () => {
  let mockSvc!: jasmine.SpyObj<DemoService>;

  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness;
    fixture: ComponentFixture<LookupMultiSelectExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(LookupMultiSelectExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);

    return { lookupHarness, fixture };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<DemoService>('DemoService', ['search']);

    TestBed.configureTestingModule({
      imports: [LookupMultiSelectExampleComponent, NoopAnimationsModule],
      providers: [
        {
          provide: DemoService,
          useValue: mockSvc,
        },
      ],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    mockSvc.search.and.callFake((searchText) =>
      of({
        hasMore: false,
        people:
          searchText === 'b'
            ? [
                {
                  name: 'Bernard',
                },
              ]
            : [],
        totalCount: 1,
      }),
    );

    await lookupHarness.enterText('b');
    await lookupHarness.selectSearchResult({
      text: 'Bernard',
    });

    expect(fixture.componentInstance.favoritesForm.value.favoriteNames).toEqual(
      [{ name: 'Shirley' }, { name: 'Bernard' }],
    );
  });

  it('should respect the selection descriptor', async () => {
    const { lookupHarness } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [
          {
            id: '21',
            name: 'Bernard',
          },
        ],
        totalCount: 1,
      }),
    );

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();

    await expectAsync(picker.getSearchAriaLabel()).toBeResolvedTo(
      'Search names',
    );
    await expectAsync(picker.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select names',
    );
  });
});
