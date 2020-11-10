import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyCountryFieldCountry
} from '@skyux/lookup';

import {
  SkyCountryFieldTestingModule
} from './country-field-testing.module';

import {
  SkyCountryFieldFixture
} from './country-field-fixture';

const COUNTRY: SkyCountryFieldCountry = {
  name: 'United States',
  iso2: 'us'
};
const DATA_SKY_ID = 'test-country-field';

//#region Test component
@Component({
  selector: 'country-field-test',
  template: `
  <sky-country-field
    data-sky-id="${DATA_SKY_ID}"
    formControlName="countryControl"
    [autocompleteAttribute]="autocompleteAttribute"
    [disabled]="disabled"
    [hideSelectedCountryFlag]="hideSelectedCountryFlag"
    (selectedCountryChange)="selectedCountryChange($event)"
  >
  </sky-country-field>
  `
})
class CountryFieldTestComponent {
  public autocompleteAttribute: string;
  public disabled: boolean;
  public hideSelectedCountryFlag: boolean;

  public selectedCountryChange(query: string): void { }
}
//#endregion Test component

describe('Country field fixture', () => {
  let fixture: ComponentFixture<CountryFieldTestComponent>;
  let testComponent: CountryFieldTestComponent;
  let countryFieldFixture: SkyCountryFieldFixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CountryFieldTestComponent
      ],
      imports: [
        SkyCountryFieldTestingModule
      ]
    });

    fixture = TestBed.createComponent(
      CountryFieldTestComponent
    );
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    countryFieldFixture = new SkyCountryFieldFixture(fixture, DATA_SKY_ID);
  });

  it('should expose the expected defaults', () => {
    // verify default values
    expect(countryFieldFixture.autocompleteAttribute).toBe('off');
    expect(countryFieldFixture.disabled).toBe(false);
  });

  it('should expose the expected properties', () => {
    // modify to non-default values
    testComponent.autocompleteAttribute = 'on';
    testComponent.disabled = true;
    fixture.detectChanges();

    // verify updated values
    expect(countryFieldFixture.autocompleteAttribute).toBe(testComponent.autocompleteAttribute);
    expect(countryFieldFixture.disabled).toBe(testComponent.disabled);
  });

  it('should properly select country', async () => {
    const selectedCountryChangeSpy = spyOn(fixture.componentInstance, 'selectedCountryChange');

    // make a selection
    await countryFieldFixture.searchAndSelectFirstResult(COUNTRY.name);
    fixture.detectChanges();
    await fixture.whenStable();

    // verify selection state
    expect(selectedCountryChangeSpy).toHaveBeenCalledWith(COUNTRY);
  });

  it('should expose search text', async () => {
    // make a selection
    await countryFieldFixture.searchAndSelectFirstResult(COUNTRY.name);
    fixture.detectChanges();
    await fixture.whenStable();

    // verify selection state
    expect(countryFieldFixture.searchText).toBe(COUNTRY.name);
  });

  it('should return undefined properties for no selection', async () => {
    const selectedCountryChangeSpy = spyOn(fixture.componentInstance, 'selectedCountryChange');

    // make a selection
    const invalidCountryName = 'not-my-country';
    await countryFieldFixture.search(invalidCountryName);

    // verify selection state
    expect(selectedCountryChangeSpy).toHaveBeenCalledTimes(0);
    expect(countryFieldFixture.searchText).toBe(invalidCountryName);
  });

  it('should show country flag by default', async () => {
    // make a selection so the flag appears
    await countryFieldFixture.searchAndSelectFirstResult(COUNTRY.name);

    // verify country flag state
    expect(countryFieldFixture.countryFlagIsVisible).toBe(true);
  });

  it('should hide country flag when requested', async () => {
    // modify to non-default values
    testComponent.hideSelectedCountryFlag = true;
    fixture.detectChanges();

    // make a selection
    await countryFieldFixture.searchAndSelectFirstResult(COUNTRY.name);

    // verify country flag state
    expect(countryFieldFixture.countryFlagIsVisible).toBe(false);
  });

  it('should be able to clear when there is no selection', async () => {
    // verify there is no selection
    expect(countryFieldFixture.searchText).toBe('');

    // clear should work when there's no selection
    await countryFieldFixture.clear();

    // verify the selection is cleared
    expect(countryFieldFixture.searchText).toBe('');
  });

  it('should be able to clear when there is a selection', async () => {
    // make a selection
    await countryFieldFixture.searchAndSelectFirstResult(COUNTRY.name);
    expect(countryFieldFixture.searchText).toBe(COUNTRY.name);

    // clear the selection
    await countryFieldFixture.clear();

    // verify the selection is cleared
    expect(countryFieldFixture.searchText).toBe('');
  });

  it('should be able to clear when results are showing', async () => {
    // perform a search, displaying results
    await countryFieldFixture.search(COUNTRY.name);
    expect(countryFieldFixture.searchText).toBe(COUNTRY.name);

    // clear the selection
    await countryFieldFixture.clear();

    // verify the selection is cleared
    expect(countryFieldFixture.searchText).toBe('');
  });

  it('should expose expected search results', async () => {
    // perform a search, displaying results
    const results = await countryFieldFixture.search(COUNTRY.name);

    // verify there are results
    expect(results.length).toBeGreaterThan(0);

    // verify the top result is as expected
    const topResult = results[0];
    expect(topResult).toEqual(COUNTRY.name);
  });
});
