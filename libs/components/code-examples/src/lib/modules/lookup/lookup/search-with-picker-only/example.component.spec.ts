import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupSearchWithPickerOnlyExampleComponent } from './example.component';
import { DemoService } from './example.service';

describe('Lookup search with picker only example', () => {
  let mockSvc: jasmine.SpyObj<DemoService>;

  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness;
    fixture: ComponentFixture<LookupSearchWithPickerOnlyExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupSearchWithPickerOnlyExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);

    return { lookupHarness, fixture };
  }

  beforeEach(() => {
    mockSvc = jasmine.createSpyObj<DemoService>('DemoService', ['search']);

    TestBed.configureTestingModule({
      imports: [LookupSearchWithPickerOnlyExampleComponent],
      providers: [
        {
          provide: DemoService,
          useValue: mockSvc,
        },
      ],
    });
  });

  it('should not open the dropdown when the input is focused', async () => {
    const { lookupHarness } = await setupTest();

    const control = await lookupHarness.getControl();
    await control.focus();

    await expectAsync(lookupHarness.isOpen()).toBeResolvedTo(false);
  });

  it('should open the show more picker when the search button is clicked', async () => {
    const { lookupHarness } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [{ name: 'Shirley' }],
        totalCount: 1,
      }),
    );

    await lookupHarness.clickSearchButton();

    const picker = await lookupHarness.getShowMorePicker();

    await expectAsync(picker.getSearchAriaLabel()).toBeResolvedTo(
      'Search names',
    );
  });

  it('should select a value through the show more picker', async () => {
    const { lookupHarness, fixture } = await setupTest();

    mockSvc.search.and.callFake((searchText) =>
      of({
        hasMore: false,
        people:
          searchText === 'sh'
            ? [{ name: 'Shirley' }]
            : [
                { name: 'Abed' },
                { name: 'Alex' },
                { name: 'Ben' },
                { name: 'Shirley' },
              ],
        totalCount: searchText === 'sh' ? 1 : 4,
      }),
    );

    await lookupHarness.clickSearchButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('sh');
    await picker.selectSearchResult({ contentText: /Shirley/ });
    await picker.saveAndClose();

    expect(fixture.componentInstance.favoritesForm.value.favoriteName).toEqual([
      { name: 'Shirley' },
    ]);
  });
});
