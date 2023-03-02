import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyCoreAdapterService,
  SkyOverlayInstance,
  SkyOverlayService,
} from '@skyux/core';
import { SkyIconType } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';

import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SliderDimension, SliderPosition } from './colorpicker-classes';
import { SkyColorpickerService } from './colorpicker.service';
import { SkyColorpickerChangeAxis } from './types/colorpicker-axis';
import { SkyColorpickerChangeColor } from './types/colorpicker-color';
import { SkyColorpickerHsva } from './types/colorpicker-hsva';
import { SkyColorpickerMessage } from './types/colorpicker-message';
import { SkyColorpickerMessageType } from './types/colorpicker-message-type';
import { SkyColorpickerOutput } from './types/colorpicker-output';
import { SkyColorpickerResult } from './types/colorpicker-result';
import { SkyColorpickerRgba } from './types/colorpicker-rgba';

let componentIdIndex = 0;

/**
 * The SKY UX-themed replacement for the HTML `input` element with `type="color"`.
 * The value that users select is driven through the `ngModel` attribute specified on
 * the `input` element.
 */
@Component({
  selector: 'sky-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  providers: [SkyColorpickerService],
  encapsulation: ViewEncapsulation.None,
})
export class SkyColorpickerComponent implements OnInit, OnDestroy {
  /**
   * The name of the [Font Awesome 4.7](https://fontawesome.com/v4.7/icons/) icon to overlay on top of the picker. Do not specify the `fa fa-` classes.
   * @internal
   */
  @Input()
  public pickerButtonIcon: string | undefined;

  /**
   * The type of icon to display. Specifying `fa` will display a Font Awesome icon, while specifying `skyux` will display an icon from the custom SKY UX icon font. Note that the custom SKY UX icon font is currently in beta.
   * @internal
   */
  @Input()
  public pickerButtonIconType: SkyIconType = 'fa';

  /**
   * The ARIA label for the colorpicker. This sets the colorpicker's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility)
   * when the colorpicker does not include a visible label. If the colorpicker includes a visible label, use `labelledBy` instead.
   * @default "Select color value"
   */
  @Input()
  public label: string | undefined;

  /**
   * The HTML element ID of the element that labels the
   * colorpicker. This sets the colorpicker's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * If the colorpicker does not include a visible label, use `label` instead.
   */
  @Input()
  public labelledBy: string | undefined;

  /**
   * Fires when users select a color in the colorpicker.
   */
  @Output()
  public selectedColorChanged = new EventEmitter<SkyColorpickerOutput>();

  /**
   * Fires when users select **Apply** in the colorpicker to apply a color.
   */
  @Output()
  public selectedColorApplied = new EventEmitter<SkyColorpickerResult>();

  /**
   * The observable to send commands to the colorpicker. The commands should
   * respect the `SkyColorPickerMessage` type.
   */
  @Input()
  public messageStream = new Subject<SkyColorpickerMessage>();

  /**
   * Whether to display a reset button to let users return to the default color.
   */
  @Input()
  public showResetButton = true;

  public set disabled(value: boolean) {
    this.#_disabled = value;
    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public set backgroundColorForDisplay(value: string | undefined) {
    this.#_backgroundColorForDisplay = value;
    if (this.pickerButtonIcon) {
      this.iconColor = this.#getAccessibleIconColor(this.selectedColor);
    }
  }

  public get backgroundColorForDisplay(): string {
    /* istanbul ignore next */
    return this.#_backgroundColorForDisplay || '#fff';
  }

  public set hue(change: SkyColorpickerChangeAxis) {
    if (
      this.#hsva &&
      change.xCoordinate !== undefined &&
      change.maxRange !== undefined
    ) {
      this.#hsva.hue = change.xCoordinate / change.maxRange;
      this.#update();
    }
  }

  public set red(change: SkyColorpickerChangeColor) {
    if (this.#hsva) {
      const rgba = this.#svc.hsvaToRgba(this.#hsva);

      // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rgba.red = change.colorValue! / change.maxRange!;
      this.#hsva = this.#svc.rgbaToHsva(rgba);
      this.#update();
    }
  }

  public set green(change: SkyColorpickerChangeColor) {
    if (this.#hsva) {
      const rgba = this.#svc.hsvaToRgba(this.#hsva);

      // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rgba.green = change.colorValue! / change.maxRange!;
      this.#hsva = this.#svc.rgbaToHsva(rgba);
      this.#update();
    }
  }

  public set blue(change: SkyColorpickerChangeColor) {
    if (this.#hsva) {
      const rgba = this.#svc.hsvaToRgba(this.#hsva);

      // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rgba.blue = change.colorValue! / change.maxRange!;
      this.#hsva = this.#svc.rgbaToHsva(rgba);
      this.#update();
    }
  }

  public set alphaAxis(change: SkyColorpickerChangeAxis) {
    if (
      this.#hsva &&
      change.xCoordinate !== undefined &&
      change.maxRange !== undefined
    ) {
      this.#hsva.alpha = change.xCoordinate / change.maxRange;
      this.#update();
    }
  }

  public set alphaColor(change: SkyColorpickerChangeColor) {
    if (this.#hsva) {
      // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#hsva.alpha = change.colorValue! / change.maxRange!;
      this.#update();
    }
  }

  public set hex(change: SkyColorpickerChangeColor) {
    this.updatePickerValues(change.color);
  }

  public set saturationAndLightness(value: SkyColorpickerChangeAxis) {
    if (
      this.#hsva &&
      value.xCoordinate !== undefined &&
      value.xAxis !== undefined &&
      value.yCoordinate !== undefined &&
      value.yAxis !== undefined
    ) {
      this.#hsva.saturation = value.xCoordinate / value.xAxis;
      this.#hsva.value = value.yCoordinate / value.yAxis;
      this.#update();
    }
  }

  public skyColorpickerAlphaId: string;
  public returnFormat: string | undefined;
  public initialColor: string | undefined;
  public lastAppliedColor: string | undefined;
  public isVisible = true;

  @ViewChild('colorpickerTemplateRef', {
    read: TemplateRef,
  })
  protected colorpickerTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButtonRef', {
    read: ElementRef,
  })
  protected triggerButtonRef: ElementRef | undefined;

  @ViewChild('colorpickerRef', {
    read: ElementRef,
  })
  protected set colorpickerRef(value: ElementRef | undefined) {
    if (value) {
      this.#_colorpickerRef = value;
      this.#destroyAffixer();

      this.#removePickerEventListeners();
      this.#pickerUnsubscribe = new Subject<void>();

      // Ensure the colorpicker has fully rendered before adding the affixer. Added to address a
      // race condition when running under production conditions.
      setTimeout(() => {
        this.#createAffixer();
        this.isPickerVisible = true;

        this.#coreAdapter.getFocusableChildrenAndApplyFocus(
          value,
          '.sky-colorpicker',
          false
        );
        this.#changeDetector.markForCheck();
      });
    }
  }

  protected get colorpickerRef(): ElementRef | undefined {
    return this.#_colorpickerRef;
  }

  protected colorpickerId: string;
  protected isOpen = false;
  protected triggerButtonId: string;
  protected skyColorpickerHexId: string;
  protected skyColorpickerRedId: string;
  protected skyColorpickerGreenId: string;
  protected skyColorpickerBlueId: string;
  protected slider: SliderPosition;
  protected allowTransparency: boolean | undefined;
  protected alphaSliderColor: string | undefined;
  protected hexText: string | undefined;
  protected hueSliderColor: string | undefined;
  protected presetColors: string[] | undefined;
  protected rgbaText: SkyColorpickerRgba | undefined;
  protected selectedColor: SkyColorpickerOutput | undefined;
  protected iconColor: string | undefined;
  protected isPickerVisible: boolean | undefined;

  #idIndex: number;
  #alphaChannel: string | undefined;
  #format: number | undefined;
  #outputFormat: string | undefined;
  #hsva: SkyColorpickerHsva | undefined;
  #sliderDimMax: SliderDimension;
  #ngUnsubscribe = new Subject<void>();
  #affixer: SkyAffixer | undefined;
  #overlay: SkyOverlayInstance | undefined;
  #pickerUnsubscribe: Subject<void> | undefined;

  #affixSvc: SkyAffixService;
  #changeDetector: ChangeDetectorRef;
  #coreAdapter: SkyCoreAdapterService;
  #overlaySvc: SkyOverlayService;
  #svc: SkyColorpickerService;
  #themeSvc: SkyThemeService | undefined;

  #_backgroundColorForDisplay: string | undefined;
  #_colorpickerRef: ElementRef | undefined;
  #_disabled = false;

  constructor(
    affixSvc: SkyAffixService,
    changeDetector: ChangeDetectorRef,
    coreAdapter: SkyCoreAdapterService,
    overlaySvc: SkyOverlayService,
    svc: SkyColorpickerService,
    @Optional() themeSvc?: SkyThemeService
  ) {
    this.#affixSvc = affixSvc;
    this.#changeDetector = changeDetector;
    this.#coreAdapter = coreAdapter;
    this.#overlaySvc = overlaySvc;
    this.#svc = svc;
    this.#themeSvc = themeSvc;

    componentIdIndex++;

    this.#idIndex = componentIdIndex;
    this.skyColorpickerRedId = `sky-colorpicker-red-${this.#idIndex}`;
    this.skyColorpickerHexId = `sky-colorpicker-hex--${this.#idIndex}`;
    this.skyColorpickerRedId = `sky-colorpicker-red--${this.#idIndex}`;
    this.skyColorpickerGreenId = `sky-colorpicker-green--${this.#idIndex}`;
    this.skyColorpickerBlueId = `sky-colorpicker-blue--${this.#idIndex}`;
    this.skyColorpickerAlphaId = `sky-colorpicker-alpha--${this.#idIndex}`;
    this.colorpickerId = `sky-colorpicker--${this.#idIndex}`;
    this.triggerButtonId = `sky-colorpicker-button--${this.#idIndex}`;

    this.#sliderDimMax = new SliderDimension(182, 270, 170, 182);
    this.slider = new SliderPosition(0, 0, 0, 0);
  }

  public setDialog(
    color: string | undefined,
    outputFormat: string,
    presetColors: Array<string>,
    alphaChannel: string,
    allowTransparency: boolean
  ): void {
    this.initialColor = color;
    this.#outputFormat = outputFormat;
    this.presetColors = presetColors;
    this.#alphaChannel = alphaChannel;
    this.allowTransparency = allowTransparency;

    if (this.#outputFormat === 'rgba') {
      this.#format = 1;
    } else if (this.#outputFormat === 'hsla') {
      this.#format = 2;
    } else {
      this.#format = 0;
    }
  }

  public ngOnInit(): void {
    this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyColorpickerMessage) => {
        this.#handleIncomingMessages(message);
      });

    this.#addTriggerButtonEventListeners();

    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          /* istanbul ignore next */
          const themeName = themeSettings.currentSettings?.theme?.name;

          // Hue/alpha slider bars have different widths in Modern theme.
          /* istanbul ignore if */
          if (themeName === 'modern') {
            this.#sliderDimMax = new SliderDimension(174, 270, 170, 174);
          } else {
            this.#sliderDimMax = new SliderDimension(182, 270, 170, 182);
          }
          this.#updateSlider();
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#removePickerEventListeners();
    this.#destroyAffixer();
    this.#destroyOverlay();
  }

  public onTriggerButtonClick(): void {
    this.#sendMessage(SkyColorpickerMessageType.Open);
  }

  public closePicker(): void {
    this.#destroyAffixer();
    this.#destroyOverlay();
    this.#removePickerEventListeners();
    this.triggerButtonRef?.nativeElement.focus();
    this.isOpen = false;
  }

  public onApplyColorClick(): void {
    if (this.selectedColor) {
      this.selectedColorChanged.emit(this.selectedColor);
      this.selectedColorApplied.emit({ color: this.selectedColor });
      this.lastAppliedColor = this.selectedColor.rgbaText;
      this.updatePickerValues(this.lastAppliedColor);
      this.backgroundColorForDisplay = this.selectedColor.rgbaText;
    }

    this.closePicker();
  }

  public onCancelClick(): void {
    // Revert picker values back to previous color.
    this.updatePickerValues(this.backgroundColorForDisplay);
    this.closePicker();
  }

  public onPresetClick(value: string): void {
    this.updatePickerValues(value);
  }

  public onResetClick(): void {
    this.#sendMessage(SkyColorpickerMessageType.Reset);
  }

  public updatePickerValues(value: string | undefined): void {
    const hsva = this.#getHsvaValue(value);
    if (hsva) {
      this.#hsva = hsva;
      this.#update();
    }
  }

  #update(): void {
    if (this.#hsva) {
      const rgba: SkyColorpickerRgba = this.#svc.hsvaToRgba(this.#hsva);
      const dRgba: SkyColorpickerRgba = this.#svc.denormalizeRGBA(rgba);

      const hsva: SkyColorpickerHsva = {
        hue: this.#hsva.hue,
        saturation: 1,
        value: 1,
        alpha: 1,
      };

      const hueRgba = this.#svc.denormalizeRGBA(this.#svc.hsvaToRgba(hsva));

      this.rgbaText = dRgba;
      this.hexText = this.#svc.hexText(dRgba, this.#alphaChannel === 'hex8');

      this.alphaSliderColor = `rgba(${dRgba.red},${dRgba.green},${dRgba.blue},${dRgba.alpha})`;
      this.hueSliderColor = `rgba(${hueRgba.red},${hueRgba.green},${hueRgba.blue},${rgba.alpha})`;

      if (
        this.#format === 0 &&
        this.#hsva.alpha < 1 &&
        this.#alphaChannel === 'hex6'
      ) {
        this.#format++;
      }

      this.selectedColor = this.#svc.skyColorpickerOut(this.#hsva);

      this.#updateSlider();
    }
  }

  #updateSlider(): void {
    if (this.#hsva && this.#sliderDimMax) {
      this.slider = new SliderPosition(
        this.#hsva.hue * this.#sliderDimMax.hue - 8,
        this.#hsva.saturation * this.#sliderDimMax.saturation - 8,
        (1 - this.#hsva.value) * this.#sliderDimMax.value - 8,
        this.#hsva.alpha * this.#sliderDimMax.alpha - 8
      );
    }
  }

  #openPicker(): void {
    this.isPickerVisible = false;
    this.#removePickerEventListeners();
    this.#destroyOverlay();
    this.#createOverlay();
    this.isOpen = true;
  }

  #sendMessage(type: SkyColorpickerMessageType) {
    this.messageStream.next({ type });
  }

  #handleIncomingMessages(message: SkyColorpickerMessage) {
    switch (message.type) {
      case SkyColorpickerMessageType.Open:
        if (!this.isOpen) {
          this.#openPicker();
        }
        break;

      case SkyColorpickerMessageType.Close:
        if (this.isOpen) {
          this.closePicker();
        }
        break;

      case SkyColorpickerMessageType.Reset:
        this.updatePickerValues(this.initialColor);
        this.backgroundColorForDisplay = this.initialColor;
        this.selectedColorChanged.emit(this.selectedColor);
        // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.selectedColorApplied.emit({ color: this.selectedColor! });
        break;

      case SkyColorpickerMessageType.ToggleResetButton:
        this.showResetButton = !this.showResetButton;
        break;
    }
  }

  #createAffixer(): void {
    if (
      this.colorpickerRef &&
      this.triggerButtonRef &&
      this.#pickerUnsubscribe
    ) {
      const affixer = this.#affixSvc.createAffixer(this.colorpickerRef);

      affixer.placementChange
        .pipe(takeUntil(this.#pickerUnsubscribe))
        .subscribe((change) => {
          this.isPickerVisible = change.placement !== null;
        });

      affixer.affixTo(this.triggerButtonRef.nativeElement, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: 'left',
        isSticky: true,
        placement: 'below',
      });

      this.#affixer = affixer;
    }
  }

  #destroyAffixer(): void {
    /*istanbul ignore else*/
    if (this.#affixer) {
      this.#affixer.destroy();
      this.#affixer = undefined;
    }
  }

  #createOverlay(): void {
    if (this.colorpickerTemplateRef) {
      const overlay = this.#overlaySvc.create({
        enableClose: false,
        enablePointerEvents: false,
        enableScroll: true,
      });

      overlay.attachTemplate(this.colorpickerTemplateRef);

      this.#overlay = overlay;
    }
  }

  #destroyOverlay(): void {
    /*istanbul ignore else*/
    if (this.#overlay) {
      this.#overlaySvc.close(this.#overlay);
      this.#overlay = undefined;
    }
  }

  #addTriggerButtonEventListeners(): void {
    fromEvent(window.document, 'keydown')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        const keyboardEvent = event as KeyboardEvent;
        const key = keyboardEvent.key?.toLowerCase();
        /* istanbul ignore else */
        if (key === 'escape') {
          this.#sendMessage(SkyColorpickerMessageType.Close);
        }
      });
  }

  #removePickerEventListeners(): void {
    /* istanbul ignore else */
    if (this.#pickerUnsubscribe) {
      this.#pickerUnsubscribe.next();
      this.#pickerUnsubscribe.complete();
      this.#pickerUnsubscribe = undefined;
    }
  }

  #getHsvaValue(value: string | undefined): SkyColorpickerHsva | undefined {
    let hsva: SkyColorpickerHsva | undefined;

    if (value) {
      if (this.#alphaChannel === 'hex8') {
        hsva = this.#svc.stringToHsva(value, true);
        if (!hsva && !this.#hsva) {
          hsva = this.#svc.stringToHsva(value, false);
        }
      } else {
        hsva = this.#svc.stringToHsva(value, false);
      }
    }

    return hsva;
  }

  // http://www.w3.org/TR/AERT#color-contrast
  #getAccessibleIconColor(
    backgroundColor: SkyColorpickerOutput | undefined
  ): string | undefined {
    if (backgroundColor) {
      const rgb = backgroundColor.rgba;
      const brightness = Math.round(
        (rgb.red * 299 + rgb.green * 587 + rgb.blue * 114) / 1000
      );
      return brightness > 125 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    }
    /* istanbul ignore next */
    return undefined;
  }
}
