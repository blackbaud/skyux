import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldCountry, SkyCountryFieldModule } from '@skyux/lookup';

import { CustomCountryFieldHarness } from './custom-country-field-harness';

@Component({
  selector: 'app-custom-country-field',
  template: `
    <sky-input-box data-sky-id="test-country-field">
      <sky-country-field [formControl]="countryControl" />
    </sky-input-box>
  `,
  imports: [ReactiveFormsModule, SkyCountryFieldModule, SkyInputBoxModule],
})
class TestComponent {
  public countryControl = new FormControl<SkyCountryFieldCountry | undefined>(
    undefined,
  );
}

describe('CustomCountryFieldHarness', () => {
  let fixture: ComponentFixture<TestComponent>;
  let harness: CustomCountryFieldHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    harness = await loader.getHarness(CustomCountryFieldHarness);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(harness).toBeTruthy();
  });

  it('should get United search results', async () => {
    const results = await harness.getUnitedSearchResultsText();
    expect(Array.isArray(results)).toBe(true);
  });

  it('should return errors', async () => {
    try {
      await harness.getUnitedSearchResultsText('unknown-country');
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeTruthy();
      expect(error.message).toContain('unknown-country');
    }
  });
});
