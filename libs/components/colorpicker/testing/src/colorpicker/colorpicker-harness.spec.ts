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
        [stacked]="stacked"
      >
        <input
          formControlName="colorpicker"
          type="text"
          [required]="required"
          [skyColorpickerInput]="skyColorpickerTest"
          [allowTransparency]="allowTransparency"
          [alphaChannel]="alphaChannel"
          [presetColors]="presetColors"
        />
      </sky-colorpicker>
      <sky-colorpicker
        data-sky-id="other-colorpicker"
        labelText="other colorpicker"
      />
    </form>
  `,
})
class TestComponent {
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public label: string | undefined;
  public labelHidden = false;
  public labelText: string | undefined;
  public labelledBy: string | undefined;
  public myForm: FormGroup;
  public showResetButton = false;
  public stacked = false;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      colorpicker: new FormControl('#f00'),
    });
  }
}
//#endregion Test component

fdescribe('Colorpicker harness', () => {
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

  it('should get aria label when set with `label` input', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.label = 'colorpicker';
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getAriaLabel()).toBeResolvedTo(
      'colorpicker',
    );
  });

  it('should get title when set with `label` input', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.label = 'colorpicker';
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.getTitle()).toBeResolvedTo(
      'colorpicker',
    );
  });

  it('should get whether colorpicker label is hidden', async () => {
    const { colorpickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'colorpicker label';
    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    await expectAsync(colorpickerHarness.isLabelHidden()).toBeResolvedTo(true);
  });

  it('should click the reset button in default', async () => {
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

  it('should click the reset button in default', async () => {
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

  // it('should throw an error if no reset button is found', async () => {
  //   const { colorpickerHarness, fixture } = await setupTest();

  //   fixture.componentInstance.showResetButton = false;
  //   fixture.detectChanges();

  //   expectAsync(colorpickerHarness.clickResetButton()).toBeRejectedWithError(
  //     'No reset button found.',
  //   );
  // });
});
