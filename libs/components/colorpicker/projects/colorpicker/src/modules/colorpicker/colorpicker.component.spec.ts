import { DebugElement } from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { expect, expectAsync, SkyAppTestUtility } from '@skyux-sdk/testing';

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
    return document.querySelector('.sky-colorpicker-container');
  }

  function openColorpicker(
    element: HTMLElement,
    compFixture: ComponentFixture<any>
  ) {
    tick();
    fixture.detectChanges();
    verifyMenuVisibility(false);

    const buttonElem = element.querySelector(
      '.sky-colorpicker-button'
    ) as HTMLElement;
    buttonElem.click();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    verifyMenuVisibility();
  }

  function getColorpickerButton(element: HTMLElement): HTMLElement {
    return element.querySelector('.sky-colorpicker-button') as HTMLElement;
  }

  function getColorpickerIcon(): HTMLElement {
    return document.querySelector('.sky-colorpicker-button-icon');
  }

  function getColorpickerButtonBackgroundColor(element: HTMLElement): string {
    const buttonElem = getColorpickerButton(element);
    return buttonElem.style.backgroundColor;
  }

  function applyColorpicker(
    element: HTMLElement,
    compFixture: ComponentFixture<ColorpickerTestComponent>
  ) {
    const buttonElem = getColorpickerContainer().querySelector(
      '.sky-btn-colorpicker-apply'
    ) as HTMLElement;
    buttonElem.click();
    tick();
    fixture.detectChanges();
  }

  function closeColorpicker(
    element: HTMLElement,
    compFixture: ComponentFixture<ColorpickerTestComponent>
  ) {
    const buttonElem = getColorpickerContainer().querySelector(
      '.sky-btn-colorpicker-close'
    ) as HTMLElement;
    buttonElem.click();
    tick();
    fixture.detectChanges();
  }

  function verifyMenuVisibility(isVisible = true) {
    const popoverElem = getColorpickerContainer();

    if (!isVisible) {
      expect(popoverElem).toBeNull();
      return;
    }

    expect(getComputedStyle(popoverElem).visibility !== 'hidden').toEqual(
      isVisible
    );
  }

  function setPresetColor(
    element: HTMLElement,
    compFixture: ComponentFixture<any>,
    key: number
  ) {
    const container = getColorpickerContainer();
    const presetColors = container.querySelectorAll(
      '.sky-preset-color'
    ) as NodeListOf<HTMLElement>;
    const applyColor = container.querySelector(
      '.sky-btn-colorpicker-apply'
    ) as HTMLButtonElement;
    presetColors[key].click();
    applyColor.click();
    applyColor.click();
    compFixture.detectChanges();
  }

  function keyHelper(keyName: string) {
    SkyAppTestUtility.fireDomEvent(window.document, 'keydown', {
      customEventInit: {
        key: keyName,
      },
    });
  }

  function mouseHelper(x: number, y: number, event: string) {
    let document = <HTMLDocument>nativeElement.parentNode.parentNode.parentNode;

    try {
      // Deprecated browser API... IE
      let mouseEventDeprecated = document.createEvent('MouseEvents');
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
        undefined
      );
      document.dispatchEvent(mouseEventDeprecated);
    } catch (error) {
      // Chrome, Safari, Firefox
      let mouseEvent = new MouseEvent(event, {
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(mouseEvent);
    }
    fixture.detectChanges();
  }

  function verifyColorpicker(
    element: HTMLElement,
    spaColor: string,
    test: string
  ) {
    fixture.detectChanges();
    fixture.whenStable();
    let inputElement: HTMLInputElement = element.querySelector('input');
    expect(inputElement.value).toBe(spaColor);
    let selectedColor: HTMLDivElement = <HTMLDivElement>(
      element.querySelector('.sky-colorpicker-input')
    );
    let browserCSS = selectedColor.style.backgroundColor
      .replace(/[rgba\(\)]/g, '')
      .split(',');
    // Some browsers convert RGBA to multiple points pass the decimal.
    let outcome = browserCSS.map((eachNumber) => {
      return Math.round(Number(eachNumber) * 100) / 100;
    });
    expect(outcome.toString()).toContain(
      test.replace(/[\s]/g, '').split(',').toString()
    );
  }

  function getElementCoords(element: Element): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2),
    };
  }

  function setInputElementValue(
    element: HTMLElement,
    name: string,
    value: string
  ) {
    fixture.detectChanges();
    fixture.whenStable();
    let inputElement: NodeListOf<Element> =
      getColorpickerContainer().querySelectorAll('.rgba-text input');
    let input: any = {
      hex: inputElement[0],
      red: inputElement[1],
      green: inputElement[2],
      blue: inputElement[3],
      alpha: inputElement[4],
    };
    input[name].value = value;
    let params: any = {
      bubbles: false,
      cancelable: false,
    };
    let inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', params.bubbles, params.cancelable);
    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    input[name].dispatchEvent(inputEvent);
    input[name].dispatchEvent(changeEvent);
    fixture.detectChanges();
    fixture.whenStable();
    return input[name];
  }

  function verifyColorpickerHidden(isHidden: boolean): void {
    const hiddenPicker = nativeElement.querySelectorAll(
      '.sky-colorpicker-hidden'
    );
    if (isHidden) {
      expect(hiddenPicker.length).toEqual(1);
    } else {
      expect(hiddenPicker.length).toEqual(0);
    }
  }

  function getResetButton(): NodeListOf<HTMLElement> {
    return nativeElement.querySelectorAll('.sky-colorpicker-reset-button');
  }
  //#endregion

  beforeEach(
    waitForAsync(() => {
      mockThemeSvc = {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
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
      }).compileComponents();
    })
  );

  afterEach(() => {
    fixture.destroy();
  });

  describe('standard setup', () => {
    let component: ColorpickerTestComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ColorpickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = <ColorpickerTestComponent>fixture.componentInstance;
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
        getColorpickerButton(nativeElement).getAttribute('aria-label')
      ).toBe(defaultLabel);
      expect(getColorpickerButton(nativeElement).getAttribute('title')).toBe(
        defaultLabel
      );
    }));

    it('should allow consumer to override aria-label and title attributes', fakeAsync(() => {
      const newLabel = 'FOOBAR';
      component.label = newLabel;

      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-label')
      ).toBe(newLabel);
      expect(getColorpickerButton(nativeElement).getAttribute('title')).toBe(
        newLabel
      );
    }));

    it('should not provide aria-labelledby attribute to button if none is specified', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-labelledby')
      ).toBeNull();
    }));

    it('should add aria-labelledby attribute to button if provided by consumer', fakeAsync(() => {
      const customLabelledBy = 'myId';
      component.labelledBy = customLabelledBy;

      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-labelledby')
      ).toBe(customLabelledBy);
    }));

    it('should not set label and title attributes if labelledby is provided by consumer', fakeAsync(() => {
      component.labelledBy = 'myId';

      fixture.detectChanges();
      tick();

      expect(
        getColorpickerButton(nativeElement).getAttribute('aria-label')
      ).toBeNull();
      expect(
        getColorpickerButton(nativeElement).getAttribute('title')
      ).toBeNull();
    }));

    it('should add icon overlay', fakeAsync(() => {
      const icon = getColorpickerIcon();
      expect(icon).toBeNull();

      fixture.componentInstance.pickerButtonIcon = 'text-color';
      fixture.componentInstance.pickerButtonIconType = 'skyux';
      fixture.detectChanges();
      tick();

      const iconNew = getColorpickerIcon();

      expect(iconNew).not.toBeNull();
    }));

    it('should output RGBA', fakeAsync(() => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement, fixture);
      setPresetColor(nativeElement, fixture, 4);
      verifyColorpicker(nativeElement, 'rgba(189,64,64,1)', '189, 64, 64');
    }));

    it('should handle undefined initial color', fakeAsync(() => {
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

      openColorpicker(nativeElement, fixture);
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#fff', '255, 255, 255');
    }));

    it('should handle RGB initial color', fakeAsync(() => {
      fixture.detectChanges();
      fixture.destroy();

      fixture = TestBed.createComponent(ColorpickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      component.selectedOutputFormat = 'rgba';
      component.selectedColor = 'rgb(0,0,255)';

      openColorpicker(nativeElement, fixture);
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'rgba(0,0,255,1)', '0, 0, 255');
    }));

    it('should output HEX', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setPresetColor(nativeElement, fixture, 4);
      verifyColorpicker(nativeElement, '#bd4040', '189, 64, 64');
    }));

    it('should accept a new HEX3 color.', fakeAsync(() => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#BC4');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'rgba(187,204,68,1)', '187, 204, 68');
    }));

    it('should accept a new HEX6 color.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#BFF666');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#bff666', '191, 246, 102');
    }));

    it('should accept a new RGB color.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'red', '77');
      setInputElementValue(nativeElement, 'green', '58');
      setInputElementValue(nativeElement, 'blue', '183');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#4d3ab7', '77, 58, 183');
    }));

    it('should accept a new RGBA color.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'red', '163');
      setInputElementValue(nativeElement, 'green', '19');
      setInputElementValue(nativeElement, 'blue', '84');
      setInputElementValue(nativeElement, 'alpha', '0.3');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#a31354', '163, 19, 84, 0.3');
    }));

    it('should accept a new HSL color.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', 'hsl(113,78%,41%)');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2aba17', '42, 186, 23');
    }));

    it('should accept a new HSLA color.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', 'hsla(231,66%,41%,0.62)');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2438ae', '36, 56, 174');
    }));

    it('should allow user to click cancel the color change.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
    }));

    it('should use the last applied color to revert to on cancel', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
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

      openColorpicker(nativeElement, fixture);
      const container = getColorpickerContainer();
      const presetColors = container.querySelectorAll(
        '.sky-preset-color'
      ) as NodeListOf<HTMLElement>;
      presetColors[0].click();
      fixture.detectChanges();
      closeColorpicker(nativeElement, fixture);

      expect(getColorpickerButtonBackgroundColor(nativeElement)).toEqual(
        initialBackgroundColor
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
      openColorpicker(nativeElement, fixture);
      const hueBar = getColorpickerContainer().querySelector('.hue');
      const axis = getElementCoords(hueBar);
      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x - 50, pageY: axis.y },
      });
      fixture.detectChanges();
      tick();
      closeColorpicker(nativeElement, fixture);

      expect(getColorpickerButtonBackgroundColor(nativeElement)).toEqual(
        initialBackgroundColor
      );
    }));

    it('should not change button displayed color when user changes input values then clicks cancel', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const initialBackgroundColor =
        getColorpickerButtonBackgroundColor(nativeElement);

      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#2B7230');
      closeColorpicker(nativeElement, fixture);

      expect(getColorpickerButtonBackgroundColor(nativeElement)).toEqual(
        initialBackgroundColor
      );
    }));

    it('should allow user to click apply the color change.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should emit a selectedColorChanged and selectedColorApplied event on submit', fakeAsync(() => {
      spyOn(
        component.colorpickerComponent.selectedColorChanged,
        'emit'
      ).and.callThrough();
      spyOn(
        component.colorpickerComponent.selectedColorApplied,
        'emit'
      ).and.callThrough();
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
      expect(
        component.colorpickerComponent.selectedColorChanged.emit
      ).toHaveBeenCalled();
      expect(
        component.colorpickerComponent.selectedColorApplied.emit
      ).toHaveBeenCalled();
    }));

    it('should accept mouse down events on hue bar.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);

      let hueBar = getColorpickerContainer().querySelector('.hue');
      let axis = getElementCoords(hueBar);

      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x, pageY: axis.y },
      });

      fixture.detectChanges();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#28e5e5', '40, 229, 229');

      openColorpicker(nativeElement, fixture);
      hueBar = getColorpickerContainer().querySelector('.hue');
      axis = getElementCoords(hueBar);
      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x - 50, pageY: axis.y },
      });
      fixture.detectChanges();
      tick();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#a3e528', '163, 229, 40');

      openColorpicker(nativeElement, fixture);
      hueBar = getColorpickerContainer().querySelector('.hue');
      axis = getElementCoords(hueBar);
      SkyAppTestUtility.fireDomEvent(hueBar, 'mousedown', {
        customEventInit: { pageX: axis.x + 50, pageY: axis.y },
      });
      fixture.detectChanges();
      tick();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#a328e5', '163, 40, 229');
    }));

    it('should accept mouse down events on alpha bar.', fakeAsync(() => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement, fixture);

      let alphaBar = getColorpickerContainer().querySelector('.alpha');
      let axis = getElementCoords(alphaBar);

      SkyAppTestUtility.fireDomEvent(alphaBar, 'mousedown', {
        customEventInit: { pageX: axis.x, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,0.5)',
        '40, 137, 229, 0.5'
      );

      openColorpicker(nativeElement, fixture);
      alphaBar = getColorpickerContainer().querySelector('.alpha');
      axis = getElementCoords(alphaBar);
      SkyAppTestUtility.fireDomEvent(alphaBar, 'mousedown', {
        customEventInit: { pageX: axis.x - 50, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,0.23)',
        '40, 137, 229, 0.23'
      );

      openColorpicker(nativeElement, fixture);
      alphaBar = getColorpickerContainer().querySelector('.alpha');
      axis = getElementCoords(alphaBar);
      SkyAppTestUtility.fireDomEvent(alphaBar, 'mousedown', {
        customEventInit: { pageX: axis.x + 50, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(
        nativeElement,
        'rgba(40,137,229,0.77)',
        '40, 137, 229, 0.77'
      );
    }));

    it('should accept mouse down events on saturation and lightness.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);

      let slBar = getColorpickerContainer().querySelector(
        '.saturation-lightness'
      );
      let axis = getElementCoords(slBar);

      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: { pageX: axis.x, pageY: axis.y },
      });
      fixture.detectChanges();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#406080', '64, 96, 128');
    }));

    it('should accept mouse dragging on saturation and lightness.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      let slBar = getColorpickerContainer().querySelector(
        '.saturation-lightness'
      );
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
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#8babcb', '139, 171, 203');

      openColorpicker(nativeElement, fixture);
      slBar = getColorpickerContainer().querySelector('.saturation-lightness');
      axis = getElementCoords(slBar);
      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: {
          pageX: axis.x + 50,
          pageY: axis.y,
        },
      });
      mouseHelper(axis.x + 50, axis.y, 'mousemove');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#285480', '40, 84, 128');

      openColorpicker(nativeElement, fixture);
      slBar = getColorpickerContainer().querySelector('.saturation-lightness');
      axis = getElementCoords(slBar);
      SkyAppTestUtility.fireDomEvent(slBar, 'mousedown', {
        customEventInit: {
          pageX: axis.x + 50,
          pageY: axis.y,
        },
      });
      mouseHelper(axis.x + 50, axis.y, 'mouseup');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#285480', '40, 84, 128');
    }));

    it('should output HSLA in css format.', fakeAsync(() => {
      component.selectedOutputFormat = 'hsla';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#123456');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'hsla(210,65%,20%,1)', '18, 52, 86');
    }));

    it('should accept HEX8 alpha conversions.', fakeAsync(() => {
      component.selectedHexType = 'hex8';
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#12345680');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'rgba(18,52,86,0.5)', '18, 52, 86, 0.5');
    }));

    it('should output CMYK in css format.', fakeAsync(() => {
      component.selectedOutputFormat = 'cmyk';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#654321');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'cmyk(0%,34%,67%,60%)', '101, 67, 33');
    }));

    it('should accept transparency', fakeAsync(() => {
      component.selectedOutputFormat = 'hsla';
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'red', '0');
      setInputElementValue(nativeElement, 'green', '0');
      setInputElementValue(nativeElement, 'blue', '0');
      setInputElementValue(nativeElement, 'alpha', '0');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'hsla(0,0%,0%,0)', '0, 0, 0, 0');
    }));

    it('should accept color change through directive host listener', fakeAsync(() => {
      component.selectedOutputFormat = 'rgba';
      openColorpicker(nativeElement, fixture);
      nativeElement.querySelector('input').value = '#4523FC';
      let inputEvent = document.createEvent('Event');
      inputEvent.initEvent('input', true, false);
      let changeEvent = document.createEvent('Event');
      changeEvent.initEvent('change', true, false);
      nativeElement.querySelector('input').dispatchEvent(inputEvent);
      nativeElement.querySelector('input').dispatchEvent(changeEvent);
      fixture.detectChanges();
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, 'rgba(69,35,252,1)', '69, 35, 252');
    }));

    it('should allow user to esc cancel the color change.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      component.colorModel = '#2889e5';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#086A93');
      keyHelper('Escape');
      fixture.detectChanges();
      verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
    }));

    it('should ignore undefined keyboard events', fakeAsync(() => {
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#086A93');
      keyHelper(undefined);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility();
    }));

    it('should specify type="button" on all button elements.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      openColorpicker(nativeElement, fixture);
      expect(
        nativeElement.querySelectorAll('button:not([type="button"])').length
      ).toBe(0);
    }));

    it('should hide when input type is set to hidden.', fakeAsync(() => {
      component.inputType = 'hidden';
      const directiveEl = fixture.debugElement.query(
        By.directive(SkyColorpickerInputDirective)
      );
      const directiveInstance = directiveEl.injector.get(
        SkyColorpickerInputDirective
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
        By.directive(SkyColorpickerInputDirective)
      );
      const directiveInstance = directiveEl.injector.get(
        SkyColorpickerInputDirective
      );
      tick();
      fixture.detectChanges();
      directiveInstance.ngOnInit();
      tick();
      fixture.detectChanges();
      tick();
      openColorpicker(nativeElement, fixture);
      fixture.detectChanges();
      verifyColorpickerHidden(false);
    }));

    it('should load with hidden reset button.', fakeAsync(() => {
      colorpickerComponent.showResetButton = false;
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(0);
      colorpickerComponent.showResetButton = true;
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(1);
    }));

    it('should reset colorpicker via reset button.', fakeAsync(() => {
      let spyOnResetColorPicker = spyOn(
        colorpickerComponent,
        'onResetClick'
      ).and.callThrough();
      fixture.detectChanges();
      tick();
      openColorpicker(nativeElement, fixture);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      const buttonElem = nativeElement.querySelector(
        '.sky-colorpicker-reset-button'
      ) as HTMLElement;
      buttonElem.click();
      tick();
      fixture.detectChanges();
      expect(spyOnResetColorPicker).toHaveBeenCalled();
      verifyColorpicker(nativeElement, 'rgba(40,137,229,1)', '40, 137, 229');
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

    it('should accept reset colorpicker via messageStream.', fakeAsync(() => {
      component.colorModel = 'rgba(40,137,229,1)';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      verifyColorpicker(nativeElement, 'rgba(40,137,229,1)', '40, 137, 229');
      tick();
      openColorpicker(nativeElement, fixture);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Reset);
      tick();
      fixture.detectChanges();
      tick();
      verifyColorpicker(nativeElement, 'rgba(40,137,229,1)', '40, 137, 229');
    }));

    it('should toggle reset button via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(1);
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(0);
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(1);
    }));

    it('should display alpha related elements by default', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      openColorpicker(nativeElement, fixture);

      const alphaBar = getColorpickerContainer().querySelector('.alpha');
      const alphaChannelBackground = fixture.debugElement.query(
        By.css('.sky-colorpicker-checkered-background')
      );

      expect(alphaBar).toBeTruthy();
      expect(alphaChannelBackground).toBeTruthy();

      const alphaInput = document.getElementById(
        component.colorpickerComponent.skyColorpickerAlphaId
      );

      expect(alphaInput).toBeTruthy();
    }));

    it('should not display alpha related elements when allowTransparency is specified', fakeAsync(() => {
      component.selectedTransparency = false;
      fixture.detectChanges();

      openColorpicker(nativeElement, fixture);

      const alphaBar = getColorpickerContainer().querySelector('.alpha');
      const alphaChannelBackground = fixture.debugElement.query(
        By.css('.sky-colorpicker-checkered-background')
      );

      expect(alphaBar).toBeFalsy();
      expect(alphaChannelBackground).toBeFalsy();

      const alphaInput = document.getElementById(
        component.colorpickerComponent.skyColorpickerAlphaId
      );

      expect(alphaInput).toBeFalsy();
    }));

    it('should enable and disable AfterViewInit using a template-driven form', async () => {
      let outermostDiv = debugElement.query(
        By.css('div > sky-colorpicker > div')
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

    it('should populate correct information if model is given but an initfial color is also given', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.colorpickerComponent.initialColor).toBe('#2889e5');
      expect(component.colorpickerComponent.lastAppliedColor).toEqual('#00f');
    }));

    it('should allow user to click cancel the color change.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      component.colorControl.setValue('#2889e5');
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
    }));

    it('should use the last applied color to revert to on cancel', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      tick();
      component.colorControl.setValue('#2889e5');
      fixture.detectChanges();
      verifyColorpicker(nativeElement, '#2889e5', '40, 137, 229');
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#BFF666');
      closeColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should allow user to click apply the color change.', fakeAsync(() => {
      component.selectedOutputFormat = 'hex';
      fixture.detectChanges();
      openColorpicker(nativeElement, fixture);
      setInputElementValue(nativeElement, 'hex', '#2B7230');
      applyColorpicker(nativeElement, fixture);
      verifyColorpicker(nativeElement, '#2b7230', '43, 114, 48');
    }));

    it('should reset colorpicker via reset button.', fakeAsync(() => {
      fixture.detectChanges();
      let spyOnResetColorPicker = spyOn(
        colorpickerComponent,
        'onResetClick'
      ).and.callThrough();
      fixture.detectChanges();
      tick();
      openColorpicker(nativeElement, fixture);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      const buttonElem = nativeElement.querySelector(
        '.sky-colorpicker-reset-button'
      ) as HTMLElement;
      buttonElem.click();
      tick();
      fixture.detectChanges();
      expect(spyOnResetColorPicker).toHaveBeenCalled();
      verifyColorpicker(nativeElement, 'rgba(40,137,229,1)', '40, 137, 229');
    }));

    it('should accept open colorpicker via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Open);
      fixture.detectChanges();
      tick();
      verifyMenuVisibility();
    }));

    it('should accept reset colorpicker via messageStream.', fakeAsync(() => {
      component.colorControl.setValue('rgba(40,137,229,1)');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      verifyColorpicker(nativeElement, 'rgba(40,137,229,1)', '40, 137, 229');
      tick();
      openColorpicker(nativeElement, fixture);
      setPresetColor(nativeElement, fixture, 4);
      fixture.detectChanges();
      tick();
      component.sendMessage(SkyColorpickerMessageType.Reset);
      tick();
      fixture.detectChanges();
      tick();
      verifyColorpicker(nativeElement, 'rgba(40,137,229,1)', '40, 137, 229');
    }));

    it('should toggle reset button via messageStream.', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(1);
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(0);
      component.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
      tick();
      fixture.detectChanges();
      tick();
      expect(getResetButton().length).toEqual(1);
    }));

    it('should only emit the form control valueChanged event once per change', (done) => {
      fixture.detectChanges();
      let callback = function () {};
      let callbackSpy = jasmine.createSpy('callback', callback);
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
        component.colorpickerComponent as any,
        'createOverlay'
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
        component.colorpickerComponent as any,
        'destroyOverlay'
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
      let outermostDiv = debugElement.query(
        By.css('form > sky-colorpicker > div')
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
    });

    it('should update foreground icon color to have proper color contrast', async () => {
      fixture.componentInstance.colorModel = '#ffffff';
      fixture.componentInstance.pickerButtonIcon = 'text-color';
      fixture.componentInstance.pickerButtonIconType = 'skyux';
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const icon = getColorpickerIcon();

      expect(icon.getAttribute('style')).toEqual('color: rgb(0, 0, 0);');

      fixture.componentInstance.colorModel = '#000000';
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(icon.getAttribute('style')).toEqual('color: rgb(255, 255, 255);');
    });

    it('should be accessible when closed', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const colorpicker = document.querySelector('sky-colorpicker');

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
