import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyPhoneFieldCountry } from '@skyux/phone-field';

import { PhoneFieldHarnessTestComponent } from './fixtures/phone-field-harness-test.component';
import { SkyPhoneFieldHarness } from './phone-field-harness';

const COUNTRY_AU: SkyPhoneFieldCountry = {
  name: 'Australia',
  iso2: 'au',
  dialCode: '+61',
};
const COUNTRY_US: SkyPhoneFieldCountry = {
  name: 'United States',
  iso2: 'us',
  dialCode: '+1',
};
const DATA_SKY_ID = 'test-phone-field';
const VALID_AU_NUMBER = '0212345678';
const VALID_US_NUMBER = '8675555309';

describe('Phone field harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    phoneFieldHarness: SkyPhoneFieldHarness;
    fixture: ComponentFixture<PhoneFieldHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [PhoneFieldHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(PhoneFieldHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const phoneFieldHarness: SkyPhoneFieldHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyPhoneFieldHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyPhoneFieldHarness);

    return { phoneFieldHarness, fixture, loader };
  }

  it('should use selected country', async () => {
    const { phoneFieldHarness, fixture } = await setupTest({
      dataSkyId: DATA_SKY_ID,
    });

    await (await phoneFieldHarness.getControl()).focus();
    // enter a valid phone number for the default country
    await (await phoneFieldHarness.getControl()).setValue(VALID_US_NUMBER);

    // expect the model to use the proper dial code and format
    await expectAsync(
      (await phoneFieldHarness.getControl()).getValue(),
    ).toBeResolvedTo(VALID_US_NUMBER);
    expect(fixture.componentInstance.phoneControl?.value).toEqual(
      '(867) 555-5309',
    );
  });

  it('should use newly selected country', async () => {
    const { phoneFieldHarness, fixture } = await setupTest({
      dataSkyId: DATA_SKY_ID,
    });
    fixture.componentInstance.selectedCountryChange.calls.reset();

    if (COUNTRY_AU.name) {
      // change the country
      await phoneFieldHarness.selectCountry(COUNTRY_AU.name);
    }

    const countryName: string | null =
      await phoneFieldHarness.getSelectedCountryName();

    const countryIos2: string | null =
      await phoneFieldHarness.getSelectedCountryIso2();

    fixture.detectChanges();
    await fixture.whenStable();

    if (COUNTRY_AU?.name && countryName) {
      expect(countryName).toBe(COUNTRY_AU.name);
    }
    if (COUNTRY_AU?.iso2 && countryIos2) {
      expect(countryIos2).toBe(COUNTRY_AU.iso2);
    }
    expect(
      fixture.componentInstance.selectedCountryChange,
    ).toHaveBeenCalledWith(jasmine.objectContaining(COUNTRY_AU));

    // enter a valid phone number for the new country
    await (await phoneFieldHarness.getControl()).setValue(VALID_AU_NUMBER);

    // expect the model to use the proper dial code and format
    await expectAsync(
      (await phoneFieldHarness.getControl()).getValue(),
    ).toBeResolvedTo(VALID_AU_NUMBER);
    expect(fixture.componentInstance.phoneControl?.value).toEqual(
      '+61 2 1234 5678',
    );
  });

  it('should return expected country search results', async () => {
    const { phoneFieldHarness, fixture } = await setupTest({
      dataSkyId: DATA_SKY_ID,
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.selectedCountryChange.calls.reset();

    if (COUNTRY_AU.name) {
      // search for a country by name
      const results = await phoneFieldHarness.searchCountry(COUNTRY_AU.name);

      fixture.detectChanges();
      await fixture.whenStable();

      // ensure no country selection has taken place yet
      expect(
        fixture.componentInstance.selectedCountryChange,
      ).toHaveBeenCalledTimes(0);

      // verify the country search results match the country
      // the dial code that exists as part of the result label is missing the leading '+'
      expect(results.length).toBe(1);
      expect(results[0]).toEqual(
        COUNTRY_AU.name + '  ' + COUNTRY_AU.dialCode?.substring(1),
      );
    }
  });

  it('should not have constructor race condition', async () => {
    // There is some concern that the delayed instantiation of the country field in the fixture's
    // constructor will cause a race condition. We attempt to access the country field as early as
    // possible here to try and trigger any race condition.

    const { phoneFieldHarness, fixture } = await setupTest({
      dataSkyId: DATA_SKY_ID,
    });

    if (COUNTRY_US.name) {
      await phoneFieldHarness.selectCountry(COUNTRY_US.name);
    }

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.selectedCountry?.name).toBe(
      COUNTRY_US.name,
    );
  });
});
