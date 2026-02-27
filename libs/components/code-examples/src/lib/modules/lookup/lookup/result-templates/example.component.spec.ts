import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupResultTemplatesExampleComponent } from './example.component';
import { DemoService } from './example.service';
import { ItemHarness } from './item-harness';

describe('Lookup result templates example', () => {
  let mockSvc!: jasmine.SpyObj<DemoService>;

  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness;
    fixture: ComponentFixture<LookupResultTemplatesExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupResultTemplatesExampleComponent,
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
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<DemoService>('DemoService', ['search']);

    TestBed.configureTestingModule({
      imports: [LookupResultTemplatesExampleComponent],
      providers: [
        {
          provide: DemoService,
          useValue: mockSvc,
        }],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley']);
  });

  it('should use the expected dropdown item template', async () => {
    const { lookupHarness } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [
          {
            name: 'Abed',
            formal: 'Mr. Nadir',
          }],
        totalCount: 1,
      }),
    );

    await lookupHarness.enterText('be');

    const results = await lookupHarness.getSearchResults();
    const templateItemHarness =
      results && (await results[0].queryHarness(ItemHarness));

    await expectAsync(templateItemHarness.getName()).toBeResolvedTo('Abed');
    await expectAsync(templateItemHarness.getFormalName()).toBeResolvedTo(
      'Mr. Nadir',
    );
  });

  it('should use the expected modal item template', async () => {
    const { lookupHarness } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [
          {
            name: 'Abed',
            formal: 'Mr. Nadir',
          }],
        totalCount: 1,
      }),
    );

    await lookupHarness.clickShowMoreButton();

    const pickerHarness = await lookupHarness.getShowMorePicker();
    await pickerHarness.enterSearchText('be');

    const results = await pickerHarness.getSearchResults();
    const templateItemHarness =
      results && (await results[0].queryHarness(ItemHarness));

    await expectAsync(templateItemHarness.getName()).toBeResolvedTo('Abed');
    await expectAsync(templateItemHarness.getFormalName()).toBeResolvedTo(
      'Mr. Nadir',
    );
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
          }],
        totalCount: 1,
      }),
    );

    await lookupHarness.enterText('be');

    const allResultHarnesses = await lookupHarness.getSearchResults();
    const firstResultHarness = allResultHarnesses[0];
    await firstResultHarness.select();

    expect(
      fixture.componentInstance.favoritesForm.controls.favoriteNames.value,
    ).toEqual([
      { name: 'Shirley', formal: 'Ms. Bennett' },
      { name: 'Abed', formal: 'Mr. Nadir' }]);
  });

  it('should respect the selection descriptor', async () => {
    const { lookupHarness } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [
          {
            name: 'Abed',
            formal: 'Mr. Nadir',
          }],
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
