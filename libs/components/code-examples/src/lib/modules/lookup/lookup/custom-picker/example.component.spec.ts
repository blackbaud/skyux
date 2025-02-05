import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupCustomPickerExampleComponent } from './example.component';
import { DemoService } from './example.service';
import { Person } from './person';
import { PickerHarness } from './picker-harness';

const people: Person[] = [
  {
    name: 'Abed',
    formal: 'Mr. Nadir',
  },
  {
    name: 'Alex',
    formal: 'Mr. Osbourne',
  },
  {
    name: 'Ben',
    formal: 'Mr. Chang',
  },
  {
    name: 'Britta',
    formal: 'Ms. Perry',
  },
  {
    name: 'Buzz',
    formal: 'Mr. Hickey',
  },
  {
    name: 'Craig',
    formal: 'Mr. Pelton',
  },
  {
    name: 'Elroy',
    formal: 'Mr. Patashnik',
  },
  {
    name: 'Garrett',
    formal: 'Mr. Lambert',
  },
  {
    name: 'Ian',
    formal: 'Mr. Duncan',
  },
  {
    name: 'Jeff',
    formal: 'Mr. Winger',
  },
  {
    name: 'Leonard',
    formal: 'Mr. Rodriguez',
  },
  {
    name: 'Neil',
    formal: 'Mr. Neil',
  },
  {
    name: 'Pierce',
    formal: 'Mr. Hawthorne',
  },
  {
    name: 'Preston',
    formal: 'Mr. Koogler',
  },
  {
    name: 'Rachel',
    formal: 'Ms. Rachel',
  },
  {
    name: 'Shirley',
    formal: 'Ms. Bennett',
  },
  {
    name: 'Todd',
    formal: 'Mr. Jacobson',
  },
  {
    name: 'Troy',
    formal: 'Mr. Barnes',
  },
  {
    name: 'Vaughn',
    formal: 'Mr. Miller',
  },
  {
    name: 'Vicki',
    formal: 'Ms. Jenkins',
  },
];

describe('Lookup custom picker example', () => {
  let mockSvc!: jasmine.SpyObj<DemoService>;

  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness;
    fixture: ComponentFixture<LookupCustomPickerExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(LookupCustomPickerExampleComponent);
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
      imports: [LookupCustomPickerExampleComponent, NoopAnimationsModule],
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

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [
          {
            name: 'Abed',
            formal: 'Mr. Nadir',
          },
        ],
        totalCount: 1,
      }),
    );

    await lookupHarness.enterText('Be');

    const allResultHarnesses = await lookupHarness.getSearchResults();
    const firstResultHarness = allResultHarnesses[0];

    if (firstResultHarness) {
      await firstResultHarness.select();
    }

    expect(fixture.componentInstance.favoritesForm.value.favoriteNames).toEqual(
      [
        { name: 'Shirley', formal: 'Ms. Bennett' },
        { name: 'Abed', formal: 'Mr. Nadir' },
      ],
    );
  });

  it('should use a custom picker', async () => {
    const { lookupHarness, fixture } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: people,
        totalCount: 20,
      }),
    );

    // Show the custom picker.
    await lookupHarness.clickShowMoreButton();

    // Use the custom picker harness to validate that selecting/deselecting items
    // updates the lookup form field.
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const customPickerHarness = await loader.getHarness(PickerHarness);

    await customPickerHarness.checkItemAt(2); // Ben (Mr. Chang)
    await customPickerHarness.checkItemAt(7); // Garret (Mr. Lambert)
    await customPickerHarness.uncheckItemAt(15); // Shirley (Ms. Bennett)

    await customPickerHarness.save();

    expect(fixture.componentInstance.favoritesForm.value.favoriteNames).toEqual(
      [
        { name: 'Ben', formal: 'Mr. Chang' },
        { name: 'Garrett', formal: 'Mr. Lambert' },
      ],
    );
  });
});
