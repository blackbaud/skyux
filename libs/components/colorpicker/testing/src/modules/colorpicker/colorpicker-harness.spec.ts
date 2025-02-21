import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyColorpickerDropdownHarness } from './colorpicker-dropdown-harness';
import { SkyColorpickerHarness } from './colorpicker-harness';

//#region Test component
@Component({
  selector: 'sky-colorpicker-test',
  template: `
    <form [formGroup]="myForm">
      <sky-colorpicker
        #skyColorpickerTest
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [label]="label"
        [labelHidden]="labelHidden"
        [labelText]="labelText"
        [labelledBy]="labelledBy"
        [pickerButtonIcon]="pickerButtonIcon"
        [showResetButton]="showResetButton"
        [stacked]="stacked"
      >
        <input
          formControlName="colorpicker"
          type="text"
          [allowTransparency]="allowTransparency"
          [required]="required"
          [skyColorpickerInput]="skyColorpickerTest"
          [presetColors]="swatches"
        />
        @if (showCustomError) {
          <sky-form-error
            errorName="wrongColor"
            errorText="That is not a good color."
          />
        }
      </sky-colorpicker>
      <sky-colorpicker
        data-sky-id="other-colorpicker"
        labelText="other colorpicker"
      />
    </form>
  `,
  standalone: false,
})
class TestComponent {
  public allowTransparency = true;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public label: string | undefined;
  public labelHidden = false;
  public labelText: string | undefined;
  public labelledBy: string | undefined;
  public myForm: FormGroup;
  public pickerButtonIcon: string | undefined;
  public showCustomError = false;
  public showResetButton = true;
  public stacked = false;
  public swatches: string[] | undefined;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      colorpicker: new FormControl('#f00'),
    });
  }
}
//#endregion Test component

describe('Colorpicker harness', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  async function setupTest(
    options: { dataSkyId?: string; theme?: 'default' | 'modern' } = {},
  ): Promise<{
    colorpickerHarness: SkyColorpickerHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets[options?.theme || 'default'],
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        SkyColorpickerModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const colorpickerHarness: SkyColorpickerHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyColorpickerHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyColorpickerHarness);

    return { colorpickerHarness, fixture, loader };
  }

  it('should get colorpicker by its data-sky-id', async () => {
    const { colorpickerHarness, fixture } = await setupTest({
      dataSkyId: 'other-colorpicker',
    });

    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getLabelText()).toBeResolvedTo(
      'other colorpicker',
    );
  });

  it('should throw an error if there is no help inline', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(
      colorpickerHarness.clickHelpInline(),
    ).toBeRejectedWithError('No help inline found.');
  });

  it('should open help inline popover when clicked', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.componentInstance.helpPopoverContent = 'This is a colorpicker';
    fixture.detectChanges();

    await colorpickerHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      colorpickerHarness.getHelpPopoverContent(),
    ).toBeResolved();
  });

  it('should get help popover content', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.componentInstance.helpPopoverContent = 'This is a colorpicker';
    fixture.detectChanges();

    await colorpickerHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      colorpickerHarness.getHelpPopoverContent(),
    ).toBeResolvedTo('This is a colorpicker');
  });

  it('should get help popover title', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.componentInstance.helpPopoverContent = 'This is a colorpicker';
    fixture.componentInstance.helpPopoverTitle = 'What is this?';
    fixture.detectChanges();

    await colorpickerHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(colorpickerHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'What is this?',
    );
  });

  it('should get colorpicker hint text', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.componentInstance.hintText = 'This is a colorpicker';
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getHintText()).toBeResolvedTo(
      'This is a colorpicker',
    );
  });

  it('should get colorpicker label text', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getLabelText()).toBeResolvedTo(
      'colorpicker',
    );
  });

  it('should check whether colorpicker required error has fired', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.detectChanges();

    const control = fixture.componentInstance.myForm.controls['colorpicker'];
    control.addValidators(Validators.required);
    control.setValue('');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(colorpickerHarness.hasRequiredError()).toBeResolvedTo(
      true,
    );
  });

  it('should check whether custom error has fired', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker';
    fixture.detectChanges();

    fixture.componentInstance.showCustomError = true;
    fixture.componentInstance.myForm.markAllAsTouched();
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.hasError('wrongColor')).toBeResolvedTo(
      true,
    );
  });

  it('should get `aria-label` when set with `label` input', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.label = 'colorpicker';
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getAriaLabel()).toBeResolvedTo(
      'colorpicker',
    );
  });

  it('should get `aria-label` when set with `labelledBy` input', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelledBy = 'colorpicker';
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getAriaLabelledby()).toBeResolvedTo(
      'colorpicker',
    );
  });

  it('should get whether colorpicker label is hidden', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker label';
    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getLabelHidden()).toBeResolvedTo(true);
  });

  it('should click the reset button in default theme', async () => {
    const { colorpickerHarness, fixture } = await setupTest({
      theme: 'default',
    });

    const control = fixture.componentInstance.myForm.controls['colorpicker'];
    control.setValue('#000');
    fixture.detectChanges();

    expect(control.value['hex']).toBe('#000');
    await colorpickerHarness.clickResetButton();
    fixture.detectChanges();

    expect(control.value['hex']).toBe('#f00');
  });

  it('should click the reset button in modern theme', async () => {
    const { colorpickerHarness, fixture } = await setupTest({
      theme: 'modern',
    });

    const control = fixture.componentInstance.myForm.controls['colorpicker'];
    control.setValue('#000');
    fixture.detectChanges();

    expect(control.value['hex']).toBe('#000');
    await colorpickerHarness.clickResetButton();
    fixture.detectChanges();

    expect(control.value['hex']).toBe('#f00');
  });

  it('should throw an error if no reset button is found', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.showResetButton = false;
    fixture.detectChanges();

    await expectAsync(
      colorpickerHarness.clickResetButton(),
    ).toBeRejectedWithError('No reset button found.');
  });

  it('should get whether reset button is shown', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    await expectAsync(colorpickerHarness.hasResetButton()).toBeResolvedTo(true);

    fixture.componentInstance.showResetButton = false;
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.hasResetButton()).toBeResolvedTo(
      false,
    );
  });

  it('should get whether colorpicker dropdown is open', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    await expectAsync(colorpickerHarness.isColorpickerOpen()).toBeResolvedTo(
      false,
    );

    await colorpickerHarness.clickColorpickerButton();
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.isColorpickerOpen()).toBeResolvedTo(
      true,
    );
  });

  it('should get whether colorpicker is stacked', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.isStacked()).toBeResolvedTo(true);
  });

  it('should get the colorpicker icon test harness', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.pickerButtonIcon = 'calendar-ltr';
    fixture.detectChanges();

    const iconHarness = await colorpickerHarness.getColorpickerIcon();
    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('calendar-ltr');
  });

  describe('colorpicker dropdown', () => {
    async function getColorpickerDropdownHarness(
      colorpickerHarness: SkyColorpickerHarness,
      fixture: ComponentFixture<TestComponent>,
    ): Promise<SkyColorpickerDropdownHarness> {
      await colorpickerHarness.clickColorpickerButton();
      fixture.detectChanges();

      return await colorpickerHarness.getColorpickerDropdown();
    }
    it('should set hex value', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.setHexValue('#000');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['hex']).toBe('#000');
    });

    it('should set red value', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.setRedValue('0');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['hex']).toBe('#000');
    });

    it('should set green value', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.setGreenValue('255');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['hex']).toBe('#ff0');
    });

    it('should set blue value', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.setBlueValue('255');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['hex']).toBe('#f0f');
    });

    it('should set alpha value', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.setAlphaValue('.5');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['rgbaText']).toBe('rgba(255,0,0,0.5)');
    });

    it('should throw an error if trying to set alpha input when transparency is not allowed', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      fixture.componentInstance.allowTransparency = false;
      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await expectAsync(
        dropdownHarness.setAlphaValue('.5'),
      ).toBeRejectedWithError('Alpha input cannot be found.');
    });

    it('should get whether transparency is allowed', async () => {
      const { colorpickerHarness, fixture } = await setupTest();
      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await expectAsync(dropdownHarness.allowsTransparency()).toBeResolvedTo(
        true,
      );

      fixture.componentInstance.allowTransparency = false;
      fixture.detectChanges();

      await expectAsync(dropdownHarness.allowsTransparency()).toBeResolvedTo(
        false,
      );
    });

    it('should get an array of swatch hexes in default theme', async () => {
      const { colorpickerHarness, fixture } = await setupTest({
        theme: 'default',
      });

      fixture.componentInstance.swatches = ['#f0f', '#0ff'];
      fixture.detectChanges();
      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await expectAsync(
        dropdownHarness.getPresetColorSwatches(),
      ).toBeResolvedTo(fixture.componentInstance.swatches);
    });

    it('should throw an error if a swatch is set to undefined', async () => {
      const { colorpickerHarness, fixture } = await setupTest({
        theme: 'default',
      });

      fixture.componentInstance.swatches = ['', '#f0f'];
      fixture.detectChanges();
      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await expectAsync(
        dropdownHarness.getPresetColorSwatches(),
      ).toBeRejectedWithError('Preset swatch is undefined.');
    });

    it('should click a swatch button in default theme', async () => {
      const { colorpickerHarness, fixture } = await setupTest({
        theme: 'default',
      });

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.componentInstance.swatches = ['#f0f', '#0ff'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.clickPresetColorSwatch('#0ff');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['hex']).toBe('#0ff');
    });

    it('should click a swatch button in modern theme', async () => {
      const { colorpickerHarness, fixture } = await setupTest({
        theme: 'modern',
      });

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.componentInstance.swatches = ['#f0f', '#0ff'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.clickPresetColorSwatch('#0ff');
      await dropdownHarness.clickApplyButton();
      fixture.detectChanges();

      expect(control.value['hex']).toBe('#0ff');
    });

    it('should throw an error if trying to click a swatch and no swatches are set', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      fixture.detectChanges();

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await expectAsync(
        dropdownHarness.clickPresetColorSwatch('#0ff'),
      ).toBeRejectedWithError('No swatches found.');
    });

    it('should click the cancel button', async () => {
      const { colorpickerHarness, fixture } = await setupTest();

      const control = fixture.componentInstance.myForm.controls['colorpicker'];
      fixture.detectChanges();
      expect(control.value).toBe('#f00');

      const dropdownHarness = await getColorpickerDropdownHarness(
        colorpickerHarness,
        fixture,
      );

      await dropdownHarness.setGreenValue('255');
      await dropdownHarness.clickCancelButton();
      fixture.detectChanges();

      expect(control.value).toBe('#f00');
    });
  });
});
