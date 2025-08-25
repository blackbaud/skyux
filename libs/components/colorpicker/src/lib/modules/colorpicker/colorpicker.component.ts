import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
} from '@angular/core';
import {
  AbstractControlDirective,
  FormControlDirective,
  FormControlName,
  NgModel,
} from '@angular/forms';
import {
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyCoreAdapterService,
  SkyIdService,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyStackingContextService,
  SkyStackingContextStratum,
} from '@skyux/core';
import {
  SKY_FORM_ERRORS_ENABLED,
  SkyRequiredStateDirective,
} from '@skyux/forms';
import { SkyThemeService } from '@skyux/theme';

import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SliderDimension, SliderPosition } from './colorpicker-classes';
import { SkyColorpickerInputService } from './colorpicker-input.service';
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
  providers: [
    SkyColorpickerInputService,
    SkyColorpickerService,
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyColorpickerComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  /**
   * The name of the icon to overlay on top of the picker.
   * @internal
   */
  @Input()
  public pickerButtonIcon: string | undefined;

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
   * The text to display as the colorpicker's label. Use this instead of a `label` element when the label is text-only.
   * Specifying `labelText` also enables automatic error message handling for standard colorpicker errors.
   */
  @Input()
  public set labelText(value: string | undefined) {
    this.#_labelText = value;
    this.#colorpickerInputSvc.labelText.next(value);
  }

  public get labelText(): string | undefined {
    return this.#_labelText;
  }

  /**
   * Whether to hide `labelText` from view.
   */
  @Input({ transform: booleanAttribute })
  public labelHidden = false;

  /**
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the colorpicker label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the colorpicker label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public hintText: string | undefined;

  /**
   * Whether the colorpicker is stacked on another form component. When specified,
   * the appropriate vertical spacing is automatically added to the text editor.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-form-field-stacked')
  public stacked = false;

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
   * respect the `SkyColorpickerMessage` type.
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
    this.#changeDetector.markForCheck();
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
          false,
        );
        this.#changeDetector.markForCheck();
      });
    }
  }

  protected get colorpickerRef(): ElementRef | undefined {
    return this.#_colorpickerRef;
  }

  @ContentChild(FormControlDirective)
  protected set formControl(value: FormControlDirective | undefined) {
    if (value) {
      this.ngControl = value;
      this.#changeDetector.markForCheck();
    }
  }

  @ContentChild(FormControlName)
  protected set formControlByName(value: FormControlName | undefined) {
    if (value) {
      this.ngControl = value;
      this.#changeDetector.markForCheck();
    }
  }

  @ContentChild(NgModel)
  protected set ngModel(value: NgModel | undefined) {
    if (value) {
      this.ngControl = value;
      this.#changeDetector.markForCheck();
    }
  }

  @ContentChild(SkyRequiredStateDirective)
  protected requiredState: SkyRequiredStateDirective | undefined;

  protected inputId: string | undefined;
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
  protected ngControl: AbstractControlDirective | undefined;

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

  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #colorpickerInputSvc = inject(SkyColorpickerInputService);
  readonly #idSvc = inject(SkyIdService);

  protected readonly errorId = this.#idSvc.generateId();

  #_backgroundColorForDisplay: string | undefined;
  #_colorpickerRef: ElementRef | undefined;
  #_disabled = false;
  #_labelText: string | undefined;

  readonly #zIndex = inject(SkyStackingContextService)
    .getZIndex(inject(SkyStackingContextStratum), inject(DestroyRef))
    .toString();

  constructor(
    affixSvc: SkyAffixService,
    changeDetector: ChangeDetectorRef,
    coreAdapter: SkyCoreAdapterService,
    overlaySvc: SkyOverlayService,
    svc: SkyColorpickerService,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#affixSvc = affixSvc;
    this.#changeDetector = changeDetector;
    this.#coreAdapter = coreAdapter;
    this.#overlaySvc = overlaySvc;
    this.#svc = svc;
    this.#themeSvc = themeSvc;

    componentIdIndex++;

    this.#idIndex = componentIdIndex;
    this.inputId = this.#idSvc.generateId();
    this.#colorpickerInputSvc.inputId.next(this.inputId);
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
    presetColors: string[],
    alphaChannel: string,
    allowTransparency: boolean,
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

  public ngAfterContentChecked(): void {
    if (this.labelText) {
      this.#colorpickerInputSvc.ariaError.next({
        hasError: !this.ngControl?.valid,
        errorId: this.errorId,
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
    this.ngControl?.control?.markAsTouched();

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
    this.#confirmSelectedColor();
  }

  public onCancelClick(): void {
    // Revert picker values back to previous color.
    this.updatePickerValues(this.backgroundColorForDisplay);
    this.closePicker();

    this.#changeDetector.markForCheck();
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

  protected onContainerEnterKeyDown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.#confirmSelectedColor();
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
        this.#hsva.alpha * this.#sliderDimMax.alpha - 8,
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

  #sendMessage(type: SkyColorpickerMessageType): void {
    this.messageStream.next({ type });
  }

  #handleIncomingMessages(message: SkyColorpickerMessage): void {
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
        verticalAlignment: 'bottom',
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
        environmentInjector: this.#environmentInjector,
        hideOthersFromScreenReaders: true,
      });
      overlay.componentRef.instance.zIndex = this.#zIndex;

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

  #getAccessibleIconColor(
    backgroundColor: SkyColorpickerOutput | undefined,
  ): string | undefined {
    if (backgroundColor) {
      // https://www.w3.org/WAI/GL/wiki/Relative_luminance
      const RsRGB = backgroundColor.rgba.red / 255;
      const GsRGB = backgroundColor.rgba.green / 255;
      const BsRGB = backgroundColor.rgba.blue / 255;

      const R =
        RsRGB <= 0.03928
          ? RsRGB / 12.92
          : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      const G =
        GsRGB <= 0.03928
          ? GsRGB / 12.92
          : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      const B =
        BsRGB <= 0.03928
          ? BsRGB / 12.92
          : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

      const relativeLuminance =
        (0.2126 * R + 0.7152 * G + 0.0722 * B) *
        (1 / backgroundColor.rgba.alpha);

      // https://www.w3.org/WAI/GL/wiki/Contrast_ratio
      return 1.05 / (relativeLuminance + 0.05) > 3
        ? 'rgb(255, 255, 255)'
        : 'rgb(0, 0, 0)';
    }
    /* istanbul ignore next */
    return undefined;
  }

  #confirmSelectedColor(): void {
    if (this.selectedColor) {
      this.selectedColorChanged.emit(this.selectedColor);
      this.selectedColorApplied.emit({ color: this.selectedColor });
      this.lastAppliedColor = this.selectedColor.rgbaText;
      this.updatePickerValues(this.lastAppliedColor);
      this.backgroundColorForDisplay = this.selectedColor.rgbaText;
    }

    this.closePicker();
  }
}
