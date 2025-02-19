import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyLiveAnnouncerTestingModule } from '@skyux/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import {
  SkyAutocompleteInputHarness,
  SkyLookupHarness,
} from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupSingleSelectExampleComponent } from './example.component';
import { DemoService } from './example.service';

describe('Lookup single-select example', () => {
  let mockSvc!: jasmine.SpyObj<DemoService>;

  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness;
    fixture: ComponentFixture<LookupSingleSelectExampleComponent>;
    control: SkyAutocompleteInputHarness;
  }> {
    const fixture = TestBed.createComponent(LookupSingleSelectExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);

    const control = await lookupHarness.getControl();

    return { lookupHarness, fixture, control };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<DemoService>('DemoService', ['search']);

    TestBed.configureTestingModule({
      imports: [
        LookupSingleSelectExampleComponent,
        NoopAnimationsModule,
        SkyLiveAnnouncerTestingModule,
      ],
      providers: [
        {
          provide: DemoService,
          useValue: mockSvc,
        },
      ],
    });
  });

  it('should set the expected initial value', async () => {
    const { control } = await setupTest();

    await expectAsync(control.getValue()).toBeResolvedTo('Shirley');
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture, control } = await setupTest();

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

    await control.setValue('b');
    await lookupHarness.selectSearchResult({
      text: 'Bernard',
    });

    expect(fixture.componentInstance.favoritesForm.value.favoriteName).toEqual([
      { name: 'Bernard' },
    ]);
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
