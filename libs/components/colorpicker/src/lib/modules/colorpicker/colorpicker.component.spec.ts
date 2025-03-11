import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAffixer, SkyIdService, SkyOverlayService } from '@skyux/core';
import { SkyHelpTestingController } from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

import { SkyColorpickerInputDirective } from './colorpicker-input.directive';
import { SkyColorpickerComponent } from './colorpicker.component';
import { ColorpickerTestComponent } from './fixtures/colorpicker-component.fixture';
import { SkyColorpickerFixturesModule } from './fixtures/colorpicker-fixtures.module';
import { ColorpickerReactiveTestComponent } from './fixtures/colorpicker-reactive-component.fixture';
import { SkyColorpickerMessageType } from './types/colorpicker-message-type';

interface ColorpickerInputElements {
  hex: HTMLInputElement;
  red: HTMLInputElement;
  green: HTMLInputElement;
  blue: HTMLInputElement;
  alpha: HTMLInputElement;
}

describe('Colorpicker Component', () => {
  let fixture: ComponentFixture<any>;
  let nativeElement: HTMLElement;
  let colorpickerComponent: SkyColorpickerComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  let debugElement: DebugElement;

  //#region helpers
  function getColorpickerContainer(): HTMLElement {
    return document.querySelector('.sky-colorpicker-container') as HTMLElement;
  }

  function openColorpicker(element: HTMLElement, className?: string): void {
    tick();
    fixture.detectChanges();
    verifyMenuVisibility(false);

    const buttonSelector = className
      ? `.${className} .sky-colorpicker-button`
      : '.sky-colorpicker-button';
    const buttonElem = element.querySelector(buttonSelector) as HTMLElement;

    buttonElem.click();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    verifyMenuVisibility();
  }

  function getAlphaBar(): HTMLElement | null {
    return getColorpickerContainer().querySelector('.alpha');
  }

  function getColorpickerButton(element: HTMLElement): HTMLElement {
    return element.querySelector('.sky-colorpicker-button') as HTMLElement;
  }

  function getColorPickerHost(element: HTMLElement): HTMLElement | null {
    return element.querySelector('sky-colorpicker');
  }

  function getColorpickerIcon(): HTMLElement | null {
    return document.querySelector('.sky-colorpicker-button-icon');
  }

  function getColorpickerButtonBackgroundColor(element: HTMLElement): string {
    const buttonElem = getColorpickerButton(element);
    return buttonElem.style.backgroundColor;
  }

  function getFormError(element: HTMLElement): HTMLElement | null {
    return element.querySelector('sky-form-error');
  }

  function getHelpInlineHostEl(element: HTMLElement): HTMLElement | null {
    return element.querySelector('sky-help-inline');
  }

  function getHelpInlineButton(element: HTMLElement): HTMLElement | null {
    return element.querySelector('.sky-help-inline');
  }

  function getHintText(element: HTMLElement): HTMLElement | null {
    return element.querySelector('.sky-colorpicker-hint-text');
  }

  function getHueBar(): HTMLElement | null {
    return getColorpickerContainer().querySelector('.hue');
  }

  function getInputElement(element: HTMLElement): HTMLInputElement | null {
    return element.querySelector('input');
  }

  function getLabel(element: HTMLElement): HTMLLabelElement | null {
    return element.querySelector('.sky-control-label');
  }

  function getPresetColors(): NodeListOf<HTMLElement> {
    return getColorpickerContainer()?.querySelectorAll('.sky-preset-color');
  }

  function getSaturationLightnessBar(): HTMLElement | null {
    return getColorpickerContainer().querySelector('.saturation-lightness');
  }

  function applyColorpicker(): void {
    const buttonElem = getColorpickerContainer().querySelector(
      '.sky-btn-colorpicker-apply',
    ) as HTMLElement;
    buttonElem.click();
    tick();
    fixture.detectChanges();
  }

  function closeColorpicker(
    element: HTMLElement,
    compFixture: ComponentFixture<ColorpickerTestComponent>,
  ): void {
    const buttonElem = getColorpickerContainer().querySelector(
      '.sky-btn-colorpicker-close',
    ) as HTMLElement;
    buttonElem.click();
    tick();
    fixture.detectChanges();
  }

  function verifyMenuVisibility(isVisible = true): void {
    const popoverElem = getColorpickerContainer();

    if (!isVisible) {
      expect(popoverElem).toBeNull();
      return;
    }

    expect(getComputedStyle(popoverElem!).visibility !== 'hidden').toEqual(
      isVisible,
    );
  }

  function setPresetColor(
    element: HTMLElement,
    compFixture: ComponentFixture<any>,
    key: number,
  ): void {
    const container = getColorpickerContainer();
    const presetColors = container?.querySelectorAll(
      '.sky-preset-color',
    ) as NodeListOf<HTMLElement>;
    const applyColor = container?.querySelector(
      '.sky-btn-colorpicker-apply',
    ) as HTMLButtonElement;
    presetColors[key].click();
    applyColor.click();
    applyColor.click();
    compFixture.detectChanges();
  }

  function keyHelper(keyName: string | undefined): void {
    SkyAppTestUtility.fireDomEvent(window.document, 'keydown', {
      customEventInit: {
        key: keyName,
      },
    });
  }

  function mouseHelper(x: number, y: number, event: string): void {
    const document = nativeElement.parentNode?.parentNode
      ?.parentNode as Document;

    try {
      // Deprecated browser API... IE
      const mouseEventDeprecated = document.createEvent('MouseEvents');
      mouseEventDeprecated.initMouseEvent(
        event,
        true,
        true,
        window,
        0,
        0,
        0,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      document.dispatchEvent(mouseEventDeprecated);
    } catch (error) {
      // Chrome, Safari, Firefox
      const mouseEvent = new MouseEvent(event, {
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(mouseEvent);
    }
    fixture.detectChanges();
  }

  async function verifyColorpicker(
    element: HTMLElement,
    spaColor: string,
    test: string,
  ): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    const inputElement: HTMLInputElement | null = getInputElement(element);
    expect(inputElement?.value).toBe(spaColor);
    const selectedColor: HTMLDivElement | null = element.querySelector(
      '.sky-colorpicker-input',
    );
    const browserCSS = selectedColor?.style.backgroundColor
      .replace(/[rgba()]/g, '')
      .split(',');
    // Some browsers convert RGBA to multiple points pass the decimal.
    const outcome = browserCSS?.map((eachNumber) => {
      return Math.round(Number(eachNumber) * 100) / 100;
    });
    expect(outcome?.toString()).toContain(
      test.replace(/[\s]/g, '').split(',').toString(),
    );
  }

  function getElementCoords(element: Element | null): {
    x: number;
    y: number;
  } {
    if (!element) {
      throw new Error('Element could not be found.');
    }

    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2),
    };
  }

  function getInputElements(): ColorpickerInputElements {
    const inputElement: NodeListOf<Element> =
      getColorpickerContainer().querySelectorAll('.rgba-text input');

    const input = {
      hex: inputElement[0] as HTMLInputElement,
      red: inputElement[1] as HTMLInputElement,
      green: inputElement[2] as HTMLInputElement,
      blue: inputElement[3] as HTMLInputElement,
      alpha: inputElement[4] as HTMLInputElement,
    };

    return input;
  }

  async function setInputElementValue(
    element: HTMLElement,
    name: keyof ColorpickerInputElements,
    value: string,
  ): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    const input = getInputElements();

    input[name].value = value;
    const params: any = {
      bubbles: false,
      cancelable: false,
    };
    const inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', params.bubbles, params.cancelable);
    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    input[name].dispatchEvent(inputEvent);
    input[name].dispatchEvent(changeEvent);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function verifyColorpickerHidden(isHidden: boolean): void {
    const hiddenPicker = nativeElement.querySelectorAll(
      '.sky-colorpicker-hidden',
    );
    if (isHidden) {
      expect(hiddenPicker.length).toEqual(1);
    } else {
      expect(hiddenPicker.length).toEqual(0);
    }
  }

  function getResetButton(): HTMLElement | null {
    return nativeElement.querySelector('.sky-colorpicker-reset-button');
  }

  function getResetButtons(): NodeListOf<HTMLElement> {
    return nativeElement.querySelectorAll('.sky-colorpicker-reset-button');
  }
  //#endregion

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SkyColorpickerFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  describe('standard setup', () => {
    let component: ColorpickerTestComponent;

    beforeEach(() => {
      spyOn(TestBed.inject(SkyIdService), 'generateId').and.callFake(
        () => `MOCK_ID`,
      );
      fixture = TestBed.createComponent(ColorpickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
      colorpickerComponent = component.colorpickerComponent;
      debugElement = fixture.debugElement;
    });

    it('should populate correct information if model is given', fakeAsync(() => {
      component.selectedColor = undefined;
      component.colorModel = '#00f';
      fixture.detectChanges();
      tick();
      expect(component.colorpickerComponent.initialColor).toBe('#00f');
      expect(component.colorpickerComponent.lastAppliedColor as any).toEqual({
        cmykText: 'cmyk(100%,100%,0%,0%)',
        hslaText: 'hsla(240,100%,50%,1)',
        rgbaText: 'rgba(0,0,255,1)',
        hsva: { hue: 240, saturation: 100, value: 100, alpha: 1 },
        rgba: { red: 0, green: 0, blue: 255, alpha: 1 },
        hsla: { hue: 240, saturation: 100, lightness: 50, alpha: 1 },
        cmyk: { cyan: 100, magenta: 100, yellow: 0, key: 0 },
        hex: '#00f',
      });
    }));

    it('should populate correct information if model is given but an initial color is also given', fakeAsync(() => {
      component.colorModel = '#00f';
      fixture.detectChanges();
      tick();
      expect(component.colorpickerComponent.initialColor).toBe('#2889e5');
      expect(component.colorpickerComponent.lastAppliedColor as any).toEqual({
        cmykText: 'cmyk(100%,100%,0%,0%)',
        hslaText: 'hsla(240,100%,50%,1)',
        rgbaText: 'rgba(0,0,255,1)',
        hsva: { hue: 240, saturation: 100, value: 100, alpha: 1 },
        rgba: { red: 0, green: 0, blue: 255, alpha: 1 },
        hsla: { hue: 240, saturation: 100, lightness: 50, alpha: 1 },
        cmyk: { cyan: 100, magenta: 100, yellow: 0, key: 0 },
        hex: '#00f',
      });
    }));

    it('should add aria-label and title attributes to button if not specified', fakeAsync(() => {
      const defaultLabel = 'Select color value';
      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-label'),
      ).toBe(defaultLabel);
      expect(getColorpickerButton(nativeElement).getAttribute('title')).toBe(
        defaultLabel,
      );
    }));

    it('should allow consumer to override aria-label and title attributes', fakeAsync(() => {
      const newLabel = 'FOOBAR';
      component.label = newLabel;

      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-label'),
      ).toBe(newLabel);
      expect(getColorpickerButton(nativeElement).getAttribute('title')).toBe(
        newLabel,
      );
    }));

    it('should not provide aria-labelledby attribute to button if none is specified', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-labelledby'),
      ).toBeNull();
    }));

    it('should add aria-labelledby attribute to button if provided by consumer', fakeAsync(() => {
      const customLabelledBy = 'myId';
      component.labelledBy = customLabelledBy;

      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-labelledby'),
      ).toBe(customLabelledBy);
    }));

    it('should not set label and title attributes if labelledby is provided by consumer', fakeAsync(() => {
      component.labelledBy = 'myId';

      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-label'),
      ).toBeNull();
      expect(
        getColorpickerButton(nativeElement).getAttribute('title'),
      ).toBeNull();
    }));

    it('should add a label if labelText is provided', () => {
      const labelText = 'Label Text';
      component.labelText = labelText;

      fixture.detectChanges();

      const label = getLabel(nativeElement);

      expect(label).toBeVisible();
      expect(label?.textContent).toBe(labelText);
    });

    it('should not display labelText if labelHidden is true', () => {
      component.labelText = 'label text';
      component.labelHidden = true;
      fixture.detectChanges();

      const label = getLabel(nativeElement);

      expect(label).not.toBeNull();
      expect(label).toHaveCssClass('sky-screen-reader-only');
    });

    it('should add the required asterisk if labelText is given and the input is required', () => {
      const labelText = 'Label Text';
      component.labelText = labelText;
      component.required = true;

      fixture.detectChanges();

      const label = getLabel(nativeElement);

      expect(label).toBeVisible();
      expect(label).toHaveCssClass('sky-control-label-required');
    });

    it('should allow setting ID if labelText is not set', () => {
      const id = 'test-id';
      component.id = id;

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(`#${id}`)).toExist();
    });

    it('should have the stacked class if stacked is true', () => {
      component.stacked = true;
      fixture.detectChanges();

      const colorpicker = getColorPickerHost(nativeElement);

      expect(colorpicker).toHaveClass('sky-form-field-stacked');
    });

    it('should not have the lg margin class if stacked is false', () => {
      const colorpicker = getColorPickerHost(nativeElement);

      expect(colorpicker).not.toHaveClass('sky-margin-stacked-lg');
    });

    it('should render help inline with popover only if label text is provided', () => {
      component.helpPopoverContent = 'popover content';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();

      component.labelText = 'labelText';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).not.toBeNull();
    });

    it('should not render help inline with popover if `labelHidden` is set', () => {
      component.helpPopoverContent = 'popover content';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();

      component.labelText = 'labelText';
      component.labelHidden = true;
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();
    });

    it('should not render help inline for popover unless popover content is set', () => {
      component.helpPopoverTitle = 'popover title';
      component.labelText = 'labelText';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();

      component.helpPopoverContent = 'popover content';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).not.toBeNull();
    });

    it('should render help inline if help key is provided', () => {
      component.helpPopoverContent = undefined;
      component.labelText = 'labelText';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();

      component.helpKey = 'helpKey.html';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).not.toBeNull();
    });

    it('should not render help inline if help key is provided and `labelHidden` is set', () => {
      component.helpPopoverContent = undefined;
      component.labelText = 'labelText';
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();

      component.helpKey = 'helpKey.html';
      component.labelHidden = true;
      fixture.detectChanges();

      expect(getHelpInlineHostEl(nativeElement)).toBeNull();
    });

    it('should set global help config with help key', async () => {
      const helpController = TestBed.inject(SkyHelpTestingController);
      component.labelText = 'label';
      component.helpKey = 'helpKey.html';
      fixture.componentInstance.helpPopoverContent = 'popover content';
      fixture.detectChanges();

      const helpInlineButton = getHelpInlineButton(nativeElement);
      helpInlineButton?.click();

      await fixture.whenStable();
      fixture.detectChanges();

      helpController.expectCurrentHelpKey('helpKey.html');
    });

    it('should render the hintText when provided', () => {
      const hintText = 'Hint text';
      component.hintText = hintText;
      fixture.detectChanges();

      const hintEl = getHintText(nativeElement);
      const colorpickerButtonEl = getColorpickerButton(fixture.nativeElement);

      expect(hintEl).not.toBeNull();
      expect(hintEl?.innerText.trim()).toBe(hintText);
      expect(
        colorpickerButtonEl?.attributes.getNamedItem('aria-describedby')?.value,
      ).toBe('MOCK_ID');
    });

    it('should add icon overlay', fakeAsync(() => {
      const icon = getColorpickerIcon();
      expect(icon).toBeNull();

      fixture.componentInstance.pickerButtonIcon = 'text';
      fixture.detectChanges();
      tick();

      const iconNew = getColorpickerIcon();

      expect(iconNew).not.toBeNull();
    }));

    it('should output RGBA', fakeAsync(async () => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement);
      setPresetColor(nativeElement, fixture, 4);
      await verifyColorpicker(
        nativeElement,
        'rgba(189,64,64,1)',
        '189, 64, 64',
      );
    }));

    it('should handle undefined initial color', fakeAsync(async () => {
      fixture.detectChanges();
      fixture.destroy();

      fixture = TestBed.createComponent(ColorpickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      component.selectedHexType = 'hex8';
      component.selectedOutputFormat = 'hex';
      component.selectedColor = undefined;

      fixture.detectChanges();
      tick();

      openColorpicker(nativeElement);
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#fff', '255, 255, 255');
    }));

    it('should handle RGB initial color', fakeAsync(async () => {
      fixture.detectChanges();
      fixture.destroy();

      fixture = TestBed.createComponent(ColorpickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      component.selectedOutputFormat = 'rgba';
      component.selectedColor = 'rgb(0,0,255)';

      openColorpicker(nativeElement);
      applyColorpicker();
      await verifyColorpicker(nativeElement, 'rgba(0,0,255,1)', '0, 0, 255');
    }));

    it('should output HEX', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      setPresetColor(nativeElement, fixture, 4);
      await verifyColorpicker(nativeElement, '#bd4040', '189, 64, 64');
    }));

    it('should accept a new HEX3 color.', fakeAsync(async () => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#BC4');
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'rgba(187,204,68,1)',
        '187, 204, 68',
      );
    }));

    it('should accept a new HEX6 color.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#BFF666');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#bff666', '191, 246, 102');
    }));

    it('should accept a new RGB color.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'red', '77');
      await setInputElementValue(nativeElement, 'green', '58');
      await setInputElementValue(nativeElement, 'blue', '183');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#4d3ab7', '77, 58, 183');
    }));

    it('should accept a new RGBA color.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'red', '163');
      await setInputElementValue(nativeElement, 'green', '19');
      await setInputElementValue(nativeElement, 'blue', '84');
      await setInputElementValue(nativeElement, 'alpha', '0.3');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#a31354', '163, 19, 84, 0.3');
    }));

    it('should accept a new HSL color.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', 'hsl(113,78%,41%)');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2aba17', '42, 186, 23');
    }));

    it('should accept a new HSLA color.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(
        nativeElement,
        'hex',
        'hsla(231,66%,41%,0.62)',
      );
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2438ae', '36, 56, 174');
    }));

    it('should accept an HSLA color with zero saturation.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hsla';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', 'hsla(0,0%,100%,0)');
      applyColorpicker();
      expect(component.lastColorApplied?.color.hslaText).toEqual(
        'hsla(0,0%,100%,0)',
      );
    }));

    it('should allow user to click cancel the color change.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      await verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
    }));

    it('should use the last applied color to revert to on cancel', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      await verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should not change button displayed color when user selects a preset color and then clicks cancel', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const initialBackgroundColor =
        getColorpickerButtonBackgroundColor(nativeElement);

      expect(initialBackgroundColor).toBeDefined();

      openColorpicker(nativeElement);
      const presetColors = getPresetColors();
      presetColors[0].click();
      fixture.detectChanges();
      closeColorpicker(nativeElement, fixture);

      expect(getColorpickerButtonBackgroundColor(nativeElement)).toEqual(
        initialBackgroundColor,
      );
    }));

    it('should not change button displayed color when user changes slider values then clicks cancel', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const initialBackgroundColor =
        getColorpickerButtonBackgroundColor(nativeElement);

      expect(initialBackgroundColor).toBeDefined();
      openColorpicker(nativeElement);
      const hueBar = getHueBar();
      const axis = getElementCoords(hueBar);
      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x - 50, pageY: axis.y },
      });
      fixture.detectChanges();
      tick();
      closeColorpicker(nativeElement, fixture);

      expect(getColorpickerButtonBackgroundColor(nativeElement)).toEqual(
        initialBackgroundColor,
      );
    }));

    it('should not change button displayed color when user changes input values then clicks cancel', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const initialBackgroundColor =
        getColorpickerButtonBackgroundColor(nativeElement);

      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      closeColorpicker(nativeElement, fixture);

      expect(getColorpickerButtonBackgroundColor(nativeElement)).toEqual(
        initialBackgroundColor,
      );
    }));

    it('should allow user to click apply the color change.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should set aria-expanded appropriately when closed with `cancel` button', fakeAsync(() => {
      const colorpickerButton = getColorpickerButton(nativeElement);
      expect(colorpickerButton.getAttribute('aria-expanded')).toBeFalsy();

      openColorpicker(nativeElement);
      expect(colorpickerButton.getAttribute('aria-expanded')).toBe('true');

      closeColorpicker(nativeElement, fixture);
      expect(colorpickerButton.getAttribute('aria-expanded')).toBe('false');
    }));

    it('should set aria-expanded appropriately when closed with `apply` button', fakeAsync(() => {
      const colorpickerButton = getColorpickerButton(nativeElement);
      expect(colorpickerButton.getAttribute('aria-expanded')).toBeFalsy();

      openColorpicker(nativeElement);
      expect(colorpickerButton.getAttribute('aria-expanded')).toBe('true');

      applyColorpicker();
      expect(colorpickerButton.getAttribute('aria-expanded')).toBe('false');
    }));

    it('should emit a selectedColorChanged and selectedColorApplied event on submit', fakeAsync(async () => {
      spyOn(
        component.colorpickerComponent.selectedColorChanged,
        'emit',
      ).and.callThrough();
      spyOn(
        component.colorpickerComponent.selectedColorApplied,
        'emit',
      ).and.callThrough();
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
      expect(
        component.colorpickerComponent.selectedColorChanged.emit,
      ).toHaveBeenCalled();
      expect(
        component.colorpickerComponent.selectedColorApplied.emit,
      ).toHaveBeenCalled();
    }));

    it('should accept mouse down events on hue bar.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);

      let hueBar = getHueBar();
      let axis = getElementCoords(hueBar);

      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x, pageY: axis.y },
      });

      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#28e5e5', '40, 229, 229');

      openColorpicker(nativeElement);
      hueBar = getHueBar();
      axis = getElementCoords(hueBar);
      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x - 50, pageY: axis.y },
      });
      fixture.detectChanges();
      tick();
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#a3e528', '163, 229, 40');

      openColorpicker(nativeElement);
      hueBar = getHueBar();
      axis = getElementCoords(hueBar);
      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x + 50, pageY: axis.y },
      });
      fixture.detectChanges();
      tick();
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#a328e5', '163, 40, 229');
    }));

    it('should accept mouse down events on alpha bar.', fakeAsync(async () => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement);

      let alphaBar = getAlphaBar();
      let axis = getElementCoords(alphaBar);

      SkyAppTestUtility.fireDomEvent(alphaBar, 'mousedown', {
        customEventInit: { pageX: axis.x, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,0.5)',
        '40, 137, 229, 0.5',
      );

      openColorpicker(nativeElement);
      alphaBar = getAlphaBar();
      axis = getElementCoords(alphaBar);
      SkyAppTestUtility.fireDomEvent(alphaBar, 'mousedown', {
        customEventInit: { pageX: axis.x - 50, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,0.23)',
        '40, 137, 229, 0.23',
      );

      openColorpicker(nativeElement);
      alphaBar = getAlphaBar();
      axis = getElementCoords(alphaBar);
      SkyAppTestUtility.fireDomEvent(alphaBar, 'mousedown', {
        customEventInit: { pageX: axis.x + 50, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,0.77)',
        '40, 137, 229, 0.77',
      );
    }));

    it('should accept mouse down events on saturation and lightness.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);

      const slBar = getSaturationLightnessBar();
      const axis = getElementCoords(slBar);

      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: { pageX: axis.x, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#406080', '64, 96, 128');
    }));

    it('should accept mouse dragging on saturation and lightness.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      let slBar = getSaturationLightnessBar();
      let axis = getElementCoords(slBar);
      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: {
          pageX: axis.x,
          pageY: axis.y,
        },
      });
      fixture.detectChanges();
      mouseHelper(axis.x - 50, axis.y - 50, 'mousemove');
      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#8babcb', '139, 171, 203');

      openColorpicker(nativeElement);
      slBar = getSaturationLightnessBar();
      axis = getElementCoords(slBar);
      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: {
          pageX: axis.x + 50,
          pageY: axis.y,
        },
      });
      mouseHelper(axis.x + 50, axis.y, 'mousemove');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#285480', '40, 84, 128');

      openColorpicker(nativeElement);
      slBar = getSaturationLightnessBar();
      axis = getElementCoords(slBar);
      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: {
          pageX: axis.x + 50,
          pageY: axis.y,
        },
      });
      mouseHelper(axis.x + 50, axis.y, 'mouseup');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#285480', '40, 84, 128');
    }));

    it('should output HSLA in css format.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hsla';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#123456');
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'hsla(210,65%,20%,1)',
        '18, 52, 86',
      );
    }));

    it('should accept HEX8 alpha conversions.', fakeAsync(async () => {
      component.selectedHexType = 'hex8';
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#12345680');
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'rgba(18,52,86,0.5)',
        '18, 52, 86, 0.5',
      );
    }));

    it('should output CMYK in css format.', fakeAsync(async () => {
      component.selectedOutputFormat = 'cmyk';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#654321');
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'cmyk(0%,34%,67%,60%)',
        '101, 67, 33',
      );
    }));

    it('should accept transparency', fakeAsync(async () => {
      component.selectedOutputFormat = 'hsla';
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'red', '0');
      await setInputElementValue(nativeElement, 'green', '0');
      await setInputElementValue(nativeElement, 'blue', '0');
      await setInputElementValue(nativeElement, 'alpha', '0');
      applyColorpicker();
      await verifyColorpicker(nativeElement, 'hsla(0,0%,0%,0)', '0, 0, 0, 0');
    }));

    it('should accept color change through directive host listener', fakeAsync(async () => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement);
      const inputElement = getInputElement(nativeElement);
      inputElement!.value = '#4523FC';
      const inputEvent = document.createEvent('Event');
      inputEvent.initEvent('input', true, false);
      const changeEvent = document.createEvent('Event');
      changeEvent.initEvent('change', true, false);
      inputElement?.dispatchEvent(inputEvent);
      inputElement?.dispatchEvent(changeEvent);
      fixture.detectChanges();
      applyColorpicker();
      await verifyColorpicker(
        nativeElement,
        'rgba(69,35,252,1)',
        '69, 35, 252',
      );
    }));

    it('should allow user to esc cancel the color change.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#086A93');
      keyHelper('Escape');
      fixture.detectChanges();
      await verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
    }));

    it('should ignore undefined keyboard events', fakeAsync(async () => {
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#086A93');
      keyHelper(undefined);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility();
    }));

    it('should specify type="button" on all button elements.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement);
      expect(
        nativeElement.querySelectorAll('button:not([type="button"])').length,
      ).toBe(0);
    }));

    it('should hide when input type is set to hidden.', fakeAsync(() => {
      component.inputType = 'hidden';
      const directiveEl = fixture.debugElement.query(
        By.directive(SkyColorpickerInputDirective),
      );
      const directiveInstance = directiveEl.injector.get(
        SkyColorpickerInputDirective,
      );
      tick();
      fixture.detectChanges();
      directiveInstance.ngOnInit();
      tick();
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();
      verifyColorpickerHidden(true);
      expect(getColorpickerContainer()).toBeTruthy();
    }));

    it('should show when input type is set to anything other than hidden.', fakeAsync(() => {
      const directiveEl = fixture.debugElement.query(
        By.directive(SkyColorpickerInputDirective),
      );
      const directiveInstance = directiveEl.injector.get(
        SkyColorpickerInputDirective,
      );
      tick();
      fixture.detectChanges();
      directiveInstance.ngOnInit();
      tick();
      fixture.detectChanges();
      tick();
      openColorpicker(nativeElement);
      fixture.detectChanges();
      verifyColorpickerHidden(false);
    }));

    it('should load with hidden reset button.', fakeAsync(() => {
      colorpickerComponent.showResetButton = false;
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton()).toBeNull();
      colorpickerComponent.showResetButton = true;
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton()).not.toBeNull();
    }));

    it('should reset colorpicker via reset button.', fakeAsync(async () => {
      const spyOnResetColorPicker = spyOn(
        colorpickerComponent,
        'onResetClick',
      ).and.callThrough();
      fixture.detectChanges();
      tick();
      openColorpicker(nativeElement);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      const buttonElem = getResetButton();
      buttonElem?.click();
      tick();
      fixture.detectChanges();
      expect(spyOnResetColorPicker).toHaveBeenCalled();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,1)',
        '40, 137, 229',
      );
    }));

    it('should accept open colorpicker via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility();
    }));

    it('should accept close colorpicker via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility(true);
      component.sendMessage(SkyColorpickerMessageType.Close);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility(false);
    }));

    it('should accept reset colorpicker via messageStream.', fakeAsync(async () => {
      component.colorModel = 'rgba(40,137,229,1)';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,1)',
        '40, 137, 229',
      );
      tick();
      openColorpicker(nativeElement);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Reset);
      tick();
      fixture.detectChanges();
      tick();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,1)',
        '40, 137, 229',
      );
    }));

    it('should toggle reset button via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(getResetButton()).not.toBeNull();
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton()).toBeNull();
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton()).not.toBeNull();
    }));

    it('should display alpha related elements by default', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      openColorpicker(nativeElement);

      const alphaBar = getAlphaBar();
      const alphaChannelBackground = fixture.debugElement.query(
        By.css('.sky-colorpicker-checkered-background'),
      );

      expect(alphaBar).toBeTruthy();
      expect(alphaChannelBackground).toBeTruthy();

      const alphaInput = document.getElementById(
        component.colorpickerComponent.skyColorpickerAlphaId,
      );

      expect(alphaInput).toBeTruthy();
    }));

    it('should not display alpha related elements when allowTransparency is specified', fakeAsync(() => {
      component.selectedTransparency = false;
      fixture.detectChanges();

      openColorpicker(nativeElement);

      const alphaBar = getAlphaBar();
      const alphaChannelBackground = fixture.debugElement.query(
        By.css('.sky-colorpicker-checkered-background'),
      );

      expect(alphaBar).toBeFalsy();
      expect(alphaChannelBackground).toBeFalsy();

      const alphaInput = document.getElementById(
        component.colorpickerComponent.skyColorpickerAlphaId,
      );

      expect(alphaInput).toBeFalsy();
    }));

    it('should enable and disable AfterViewInit using a template-driven form', async () => {
      const outermostDiv = debugElement.query(
        By.css('div > sky-colorpicker > div'),
      ).nativeElement;

      expect(outermostDiv).not.toHaveCssClass('sky-colorpicker-disabled');

      component.disabled = true;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(outermostDiv).toHaveCssClass('sky-colorpicker-disabled');

      component.disabled = false;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(outermostDiv).not.toHaveCssClass('sky-colorpicker-disabled');
    });

    it('should apply the selected color when Enter is pressed', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();

      openColorpicker(nativeElement);

      await setInputElementValue(nativeElement, 'hex', '#2B7230');

      const inputElements = getInputElements();
      inputElements.alpha.focus();

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      inputElements.alpha.dispatchEvent(enterEvent);
      fixture.detectChanges();
      tick();

      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');

      flush();
    }));

    it('should hide siblings from screen readers', fakeAsync(() => {
      fixture.detectChanges();

      const overlaySpy = spyOn(
        TestBed.inject(SkyOverlayService),
        'create',
      ).and.callThrough();

      openColorpicker(nativeElement);

      expect(overlaySpy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          hideOthersFromScreenReaders: true,
        }),
      );
    }));
  });

  describe('reactive configuration', () => {
    let component: ColorpickerReactiveTestComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ColorpickerReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
      colorpickerComponent = component.colorpickerComponent;
      debugElement = fixture.debugElement;
    });

    it('should populate correct information if model is given', fakeAsync(() => {
      component.initialColor = undefined;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(component.colorpickerComponent.initialColor).toBe('#00f');
      expect(component.colorpickerComponent.lastAppliedColor).toEqual('#00f');
    }));

    it('should populate correct information if model is given but an initial color is also given', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.colorpickerComponent.initialColor).toBe('#2889e5');
      expect(component.colorpickerComponent.lastAppliedColor).toEqual('#00f');
    }));

    it('should allow user to click cancel the color change.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      component.colorControl.setValue('#2889e5');
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      await verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
    }));

    it('should use the last applied color to revert to on cancel', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      tick();
      component.colorControl.setValue('#2889e5');
      fixture.detectChanges();
      await verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should allow user to click apply the color change.', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker();
      await verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should update the reactive form value when the user applies a color change', fakeAsync(async () => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker();
      await fixture.whenStable();
      expect(component.colorForm.get('colorModel')?.value.hex).toBe('#2b7230');
    }));

    it('should reset colorpicker via reset button.', fakeAsync(async () => {
      fixture.detectChanges();
      const spyOnResetColorPicker = spyOn(
        colorpickerComponent,
        'onResetClick',
      ).and.callThrough();
      fixture.detectChanges();
      tick();
      openColorpicker(nativeElement);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      const buttonElem = getResetButton();
      buttonElem?.click();
      tick();
      fixture.detectChanges();
      expect(spyOnResetColorPicker).toHaveBeenCalled();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,1)',
        '40, 137, 229',
      );
    }));

    it('should accept open colorpicker via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility();
    }));

    it('should accept reset colorpicker via messageStream.', fakeAsync(async () => {
      component.colorControl.setValue('rgba(40,137,229,1)');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,1)',
        '40, 137, 229',
      );
      tick();
      openColorpicker(nativeElement);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Reset);
      tick();
      fixture.detectChanges();
      tick();
      await verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,1)',
        '40, 137, 229',
      );
    }));

    it('should toggle reset button via messageStream', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(getResetButtons().length).toEqual(2);
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      // There are 2 colorpicker components and only one is using the message stream
      expect(getResetButtons().length).toEqual(1);
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButtons().length).toEqual(2);
    }));

    it('should only emit the form control valueChanged event once per change', (done) => {
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const callback = function (): void {};
      const callbackSpy = jasmine.createSpy('callback', callback);
      component.colorForm.valueChanges.subscribe(() => {
        callbackSpy();
      });
      // This will give us 10 milliseconds pause before emitting the final valueChanges event that
      // was fired. Testing was done to ensure this was enough time to catch any bad behavior
      component.colorForm.valueChanges.pipe(sampleTime(10)).subscribe(() => {
        expect(callbackSpy).toHaveBeenCalledTimes(1);
        done();
      });
      component.colorForm.setValue(component.newValues);
    });

    it('should only open via message stream if picker is closed', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const overlaySpy = spyOn(
        TestBed.inject(SkyOverlayService),
        'create',
      ).and.callThrough();

      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();

      verifyMenuVisibility();
      expect(overlaySpy).toHaveBeenCalledTimes(1);
      overlaySpy.calls.reset();

      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();

      expect(overlaySpy).toHaveBeenCalledTimes(0);
    }));

    it('should only close via message stream if picker is opened', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();

      verifyMenuVisibility();

      const overlaySpy = spyOn(
        SkyAffixer.prototype,
        'destroy',
      ).and.callThrough();

      component.sendMessage(SkyColorpickerMessageType.Close);
      fixture.detectChanges();
      tick();

      verifyMenuVisibility(false);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
      overlaySpy.calls.reset();

      component.sendMessage(SkyColorpickerMessageType.Close);
      fixture.detectChanges();
      tick();

      expect(overlaySpy).toHaveBeenCalledTimes(0);
    }));

    it('should enable and disable AfterViewInit using a reactive form', async () => {
      const outermostDiv = debugElement.query(
        By.css('form > sky-colorpicker > div'),
      ).nativeElement;

      expect(outermostDiv).not.toHaveCssClass('sky-colorpicker-disabled');

      component.colorForm.controls['colorModel'].disable();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(outermostDiv).toHaveCssClass('sky-colorpicker-disabled');

      component.colorForm.controls['colorModel'].enable();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(outermostDiv).not.toHaveCssClass('sky-colorpicker-disabled');
    });

    it('should render an error message if the form control set via name has an error', fakeAsync(async () => {
      component.labelText = 'Label Text';

      fixture.detectChanges();

      let inputElement: HTMLInputElement | null =
        getInputElement(nativeElement);

      expect(inputElement?.getAttribute('aria-invalid')).toBeNull();
      expect(inputElement?.getAttribute('aria-errormessage')).toBeNull();

      openColorpicker(nativeElement);
      await setInputElementValue(nativeElement, 'red', '163');
      await setInputElementValue(nativeElement, 'green', '19');
      await setInputElementValue(nativeElement, 'blue', '84');
      await setInputElementValue(nativeElement, 'alpha', '0.5');
      applyColorpicker();

      fixture.detectChanges();

      inputElement = getInputElement(nativeElement);

      expect(inputElement?.getAttribute('aria-invalid')).toBe('true');
      expect(inputElement?.getAttribute('aria-errormessage')).toBeDefined();

      const errorMessage = getFormError(nativeElement);

      expect(errorMessage).toBeVisible();
    }));

    it('should render an error message if the form control has an error set via form control', fakeAsync(async () => {
      fixture.detectChanges();

      const colorPickerTest2: HTMLElement | null = nativeElement.querySelector(
        '.colorpicker-form-control',
      );

      if (colorPickerTest2) {
        let inputElement: HTMLInputElement | null =
          getInputElement(colorPickerTest2);

        expect(inputElement?.getAttribute('aria-invalid')).toBeNull();
        expect(inputElement?.getAttribute('aria-errormessage')).toBeNull();

        openColorpicker(nativeElement, 'colorpicker-form-control');
        await setInputElementValue(nativeElement, 'red', '163');
        await setInputElementValue(nativeElement, 'green', '19');
        await setInputElementValue(nativeElement, 'blue', '84');
        await setInputElementValue(nativeElement, 'alpha', '0.5');
        applyColorpicker();

        fixture.detectChanges();

        inputElement = getInputElement(colorPickerTest2);

        expect(inputElement?.getAttribute('aria-invalid')).toBe('true');
        expect(inputElement?.getAttribute('aria-errormessage')).toBeDefined();

        const errorMessage = getFormError(nativeElement);

        expect(errorMessage).toBeVisible();
      } else {
        fail('Did not find colorpicker under test');
      }
    }));

    it('should add the required asterisk if labelText is given and the input is required', () => {
      const labelText = 'Label Text';
      component.labelText = labelText;
      component.required = true;

      fixture.detectChanges();

      const label = getLabel(nativeElement);

      expect(label).toBeVisible();
      expect(label).toHaveCssClass('sky-control-label-required');
    });
  });

  describe('accessibility', () => {
    const axeConfig = {
      rules: {
        region: {
          enabled: false,
        },
      },
    };

    beforeEach(() => {
      fixture = TestBed.createComponent(ColorpickerTestComponent);
      nativeElement = fixture.nativeElement;
    });

    it('should update foreground icon color to have proper color contrast', async () => {
      fixture.componentInstance.colorModel = '#ffffff';
      fixture.componentInstance.pickerButtonIcon = 'text';
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const icon = getColorpickerIcon();

      expect(icon?.getAttribute('style')).toEqual('color: rgb(0, 0, 0);');

      fixture.componentInstance.colorModel = '#000000';
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(icon?.getAttribute('style')).toEqual('color: rgb(255, 255, 255);');
    });

    it('should update icon color from black to white when opacity of dark color is lowered', fakeAsync(async () => {
      fixture.componentInstance.colorModel = '#ff0000';
      fixture.componentInstance.pickerButtonIcon = 'calendar-ltr';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const icon = getColorpickerIcon();
      expect(icon?.getAttribute('style')).toEqual('color: rgb(255, 255, 255);');

      openColorpicker(fixture.nativeElement);
      await setInputElementValue(fixture.nativeElement, 'alpha', '0.3');
      applyColorpicker();

      expect(icon?.getAttribute('style')).toEqual('color: rgb(0, 0, 0);');
    }));

    it('should keep icon color black when a light color opacity is lowered', fakeAsync(async () => {
      fixture.componentInstance.colorModel = '#ffffff';
      fixture.componentInstance.pickerButtonIcon = 'calendar';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const icon = getColorpickerIcon();
      expect(icon?.getAttribute('style')).toEqual('color: rgb(0, 0, 0);');

      openColorpicker(fixture.nativeElement);
      await setInputElementValue(fixture.nativeElement, 'alpha', '0.3');
      applyColorpicker();

      expect(icon?.getAttribute('style')).toEqual('color: rgb(0, 0, 0);');
    }));

    it('should set icon color to white when alpha is 0', fakeAsync(async () => {
      fixture.componentInstance.colorModel = '#ff0000';
      fixture.componentInstance.pickerButtonIcon = 'calendar-ltr';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const icon = getColorpickerIcon();
      expect(icon?.getAttribute('style')).toEqual('color: rgb(255, 255, 255);');

      openColorpicker(fixture.nativeElement);
      await setInputElementValue(fixture.nativeElement, 'alpha', '0.0');
      applyColorpicker();

      expect(icon?.getAttribute('style')).toEqual('color: rgb(0, 0, 0);');
    }));

    it('should be accessible when closed', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const colorpicker = getColorPickerHost(nativeElement);

      await expectAsync(colorpicker).toBeAccessible(axeConfig);
    });

    it('should be accessible when open', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      fixture.componentInstance.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      const colorpickerContainer = getColorpickerContainer();

      await expectAsync(colorpickerContainer).toBeAccessible(axeConfig);
    });
  });
});
