import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyPhoneFieldCountry } from '@skyux/phone-field';
import { SkyPhoneFieldHarness } from '@skyux/phone-field/testing';

import { PhoneFieldBasicExampleComponent } from './example.component';

const COUNTRY_AU: SkyPhoneFieldCountry = {
  name: 'Australia',
  iso2: 'au',
  dialCode: '+61',
};

const DATA_SKY_ID = 'my-phone-field';
const VALID_AU_NUMBER = '0212345678';
const VALID_US_NUMBER = '8675555309';

describe('Basic phone field example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyPhoneFieldHarness;
    fixture: ComponentFixture<PhoneFieldBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(PhoneFieldBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
      )
    ).queryHarness(SkyPhoneFieldHarness);

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhoneFieldBasicExampleComponent, NoopAnimationsModule],
    });
  });

  it('should set up phone field input and clear value', async () => {
    const { harness } = await setupTest({
      dataSkyId: DATA_SKY_ID,
    });

    // First, set a value on the phoneField.
    const inputHarness = await harness.getControl();
    await inputHarness.focus();
    await inputHarness.setValue(VALID_US_NUMBER);

    await expectAsync(inputHarness.getValue()).toBeResolvedTo(VALID_US_NUMBER);

    // Now, clear the value.
    await inputHarness.clear();
    await expectAsync(inputHarness.getValue()).toBeResolvedTo('');
  });

  it('should use selected country', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: DATA_SKY_ID,
    });

    const inputHarness = await harness.getControl();
    await inputHarness.focus();
    // enter a valid phone number for the default country
    await inputHarness.setValue(VALID_US_NUMBER);

    // expect the model to use the proper dial code and format
    await expectAsync(inputHarness.getValue()).toBeResolvedTo(VALID_US_NUMBER);
    expect(fixture.componentInstance.phoneControl.value).toEqual(
      '(867) 555-5309',
    );

    if (COUNTRY_AU.name) {
      // change the country
      await harness.selectCountry(COUNTRY_AU.name);
    }

    const countryName: string | null = await harness.getSelectedCountryName();

    const countryIos2: string | null = await harness.getSelectedCountryIso2();

    fixture.detectChanges();
    await fixture.whenStable();

    if (COUNTRY_AU.name && countryName) {
      expect(countryName).toBe(COUNTRY_AU.name);
    }
    if (COUNTRY_AU.iso2 && countryIos2) {
      expect(countryIos2).toBe(COUNTRY_AU.iso2);
    }

    // enter a valid phone number for the new country
    await inputHarness.setValue(VALID_AU_NUMBER);

    // expect the model to use the proper dial code and format
    await expectAsync(inputHarness.getValue()).toBeResolvedTo(VALID_AU_NUMBER);
    expect(fixture.componentInstance.phoneControl.value).toEqual(
      '+61 2 1234 5678',
    );
  });
});
