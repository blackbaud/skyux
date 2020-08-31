import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixAutoFitContext,
  SkyAffixer,
  SkyAffixService,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyCoreAdapterService
} from '@skyux/core';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyColorpickerChangeAxis
} from './types/colorpicker-axis';

import {
  SkyColorpickerChangeColor
} from './types/colorpicker-color';

import {
  SkyColorpickerHsla
} from './types/colorpicker-hsla';

import {
  SkyColorpickerHsva
} from './types/colorpicker-hsva';

import {
  SkyColorpickerMessage
} from './types/colorpicker-message';

import {
  SkyColorpickerMessageType
} from './types/colorpicker-message-type';

import {
  SkyColorpickerOutput
} from './types/colorpicker-output';

import {
  SkyColorpickerRgba
} from './types/colorpicker-rgba';

import {
  SkyColorpickerResult
} from './types/colorpicker-result';

import {
  SkyColorpickerService
} from './colorpicker.service';

import {
  SliderPosition,
  SliderDimension
} from './colorpicker-classes';

let componentIdIndex = 0;

/**
 * Provides a SKY UX-themed replacement for the HTML `input` element with `type="color"`.
 * The value that users select is driven through the `ngModel` attribute specified on
 * the `input` element.
 */
@Component({
  selector: 'sky-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})

export class SkyColorpickerComponent implements OnInit, OnDestroy {
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
   * Specifies a message stream to toggle the reset button on and off.
   */
  @Input()
  public messageStream = new Subject<SkyColorpickerMessage>();

  /**
   * Indicates whether to display a reset button to let users return to the default color.
   */
  @Input()
  public showResetButton = true;

  public idIndex: number;
  public skyColorpickerHexId: string;
  public skyColorpickerRedId: string;
  public skyColorpickerGreenId: string;
  public skyColorpickerBlueId: string;
  public skyColorpickerAlphaId: string;
  public alphaChannel: string;
  public allowTransparency: boolean;
  public alphaSliderColor: string;
  public arrowTop: number;
  public format: number;
  public hexText: string;
  public hslaText: SkyColorpickerHsla;
  public hueSliderColor: string;
  public outputFormat: string;
  public presetColors: Array<string>;
  public returnFormat: string;
  public rgbaText: SkyColorpickerRgba;
  public selectedColor: SkyColorpickerOutput;
  public slider: SliderPosition;
  public initialColor: string;
  public lastAppliedColor: string;
  public isPickerVisible: boolean;

  public backgroundColorForDisplay: string = '#fff';

  public colorpickerId: string;

  public isOpen: boolean = false;

  public isVisible: boolean = true;

  public triggerButtonId: string;

  @ViewChild('colorpickerTemplateRef', {
    read: TemplateRef
  })
  private colorpickerTemplateRef: TemplateRef<any>;

  @ViewChild('triggerButtonRef', {
    read: ElementRef
  })
  private triggerButtonRef: ElementRef;

  @ViewChild('colorpickerRef', {
    read: ElementRef
  })
  private set colorpickerRef(value: ElementRef) {
    if (value) {
      this._colorpickerRef = value;
      this.destroyAffixer();

      this.removePickerEventListeners();
      this.pickerUnsubscribe = new Subject<void>();

      // Ensure the colorpicker has fully rendered before adding the affixer. Added to address a
      // race condition when running under production conditions.
      setTimeout(() => {
        this.createAffixer();
        this.isPickerVisible = true;

        this.coreAdapter.getFocusableChildrenAndApplyFocus(value, '.sky-colorpicker', false);
        this.changeDetector.markForCheck();
      });
    }
  }

  private get colorpickerRef(): ElementRef {
    return this._colorpickerRef;
  }

  private hsva: SkyColorpickerHsva;
  private sliderDimMax: SliderDimension;
  private ngUnsubscribe = new Subject();

  private affixer: SkyAffixer;

  private overlay: SkyOverlayInstance;

  private pickerUnsubscribe: Subject<void>;

  private _colorpickerRef: ElementRef;

  constructor(
    private affixService: SkyAffixService,
    private changeDetector: ChangeDetectorRef,
    private coreAdapter: SkyCoreAdapterService,
    private overlayService: SkyOverlayService,
    private service: SkyColorpickerService
  ) {
    componentIdIndex++;

    this.idIndex = componentIdIndex;
    this.skyColorpickerRedId = 'sky-colorpicker-red-' + this.idIndex;
    this.skyColorpickerHexId = 'sky-colorpicker-hex-' + this.idIndex;
    this.skyColorpickerRedId = 'sky-colorpicker-red-' + this.idIndex;
    this.skyColorpickerGreenId = 'sky-colorpicker-green-' + this.idIndex;
    this.skyColorpickerBlueId = 'sky-colorpicker-blue-' + this.idIndex;
    this.skyColorpickerAlphaId = 'sky-colorpicker-alpha-' + this.idIndex;
    this.colorpickerId = `sky-colorpicker-${this.idIndex}`;
    this.triggerButtonId = `sky-colorpicker-button-${this.idIndex}`;
  }

  public setDialog(
    instance: any,
    elementRef: ElementRef,
    color: any,
    outputFormat: string,
    presetColors: Array<string>,
    alphaChannel: string,
    allowTransparency: boolean
  ) {
    this.initialColor = color;
    this.outputFormat = outputFormat;
    this.presetColors = presetColors;
    this.alphaChannel = alphaChannel;
    this.allowTransparency = allowTransparency;

    if (this.outputFormat === 'rgba') {
      this.format = 1;
    } else if (this.outputFormat === 'hsla') {
      this.format = 2;
    } else {
      this.format = 0;
    }
  }

  public ngOnInit() {
    this.sliderDimMax = new SliderDimension(182, 270, 170, 182);
    this.slider = new SliderPosition(0, 0, 0, 0);
    this.messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyColorpickerMessage) => {
        this.handleIncomingMessages(message);
      });

    this.addTriggerButtonEventListeners();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.removePickerEventListeners();
    this.destroyAffixer();
    this.destroyOverlay();
  }

  public onTriggerButtonClick(): void {
    this.sendMessage(SkyColorpickerMessageType.Open);
  }

  public closePicker() {
    this.setColorFromString(this.lastAppliedColor);
    this.destroyAffixer();
    this.destroyOverlay();
    this.removePickerEventListeners();
    this.triggerButtonRef.nativeElement.focus();
    this.isOpen = false;
  }

  public resetPickerColor() {
    this.sendMessage(SkyColorpickerMessageType.Reset);
  }

  public applyColor() {
    this.selectedColorChanged.emit(this.selectedColor);
    this.selectedColorApplied.emit({ color: this.selectedColor });
    this.lastAppliedColor = this.selectedColor.rgbaText;
    this.closePicker();
  }

  public setColorFromString(value: string) {
    let hsva: SkyColorpickerHsva;

    if (this.alphaChannel === 'hex8') {
      hsva = this.service.stringToHsva(value, true);
      if (!hsva && !this.hsva) {
        hsva = this.service.stringToHsva(value, false);
      }

    } else {
      hsva = this.service.stringToHsva(value, false);
    }

    if (hsva) {
      this.hsva = hsva;
      this.update();
    }

    // Update trigger button's background color.
    this.backgroundColorForDisplay = this.selectedColor.rgbaText;
  }

  public set hue(change: SkyColorpickerChangeAxis) {
    this.hsva.hue = change.xCoordinate / change.maxRange;
    this.update();
  }

  public set red(change: SkyColorpickerChangeColor) {
    let rgba = this.service.hsvaToRgba(this.hsva);
    rgba.red = change.colorValue / change.maxRange;
    this.hsva = this.service.rgbaToHsva(rgba);
    this.update();
  }

  public set green(change: SkyColorpickerChangeColor) {
    let rgba = this.service.hsvaToRgba(this.hsva);
    rgba.green = change.colorValue / change.maxRange;
    this.hsva = this.service.rgbaToHsva(rgba);
    this.update();
  }

  public set blue(change: SkyColorpickerChangeColor) {
    let rgba = this.service.hsvaToRgba(this.hsva);
    rgba.blue = change.colorValue / change.maxRange;
    this.hsva = this.service.rgbaToHsva(rgba);
    this.update();
  }

  public set alphaAxis(change: SkyColorpickerChangeAxis) {
    this.hsva.alpha = change.xCoordinate / change.maxRange;
    this.update();
  }

  public set alphaColor(change: SkyColorpickerChangeColor) {
    this.hsva.alpha = change.colorValue / change.maxRange;
    this.update();
  }

  public set hex(change: SkyColorpickerChangeColor) {
    this.setColorFromString(change.color);
  }

  public set saturationAndLightness(value: SkyColorpickerChangeAxis) {
    this.hsva.saturation = value.xCoordinate / value.xAxis;
    this.hsva.value = value.yCoordinate / value.yAxis;
    this.update();
  }

  public update() {
    let hsla: SkyColorpickerHsla = this.service.hsva2hsla(this.hsva);
    let dHsla: SkyColorpickerHsla = this.service.denormalizeHSLA(hsla);
    let rgba: SkyColorpickerRgba = this.service.hsvaToRgba(this.hsva);
    let dRgba: SkyColorpickerRgba = this.service.denormalizeRGBA(rgba);

    let hsva: SkyColorpickerHsva = {
      'hue': this.hsva.hue,
      'saturation': 1,
      'value': 1,
      'alpha': 1
    };

    let hueRgba = this.service.denormalizeRGBA(
      this.service.hsvaToRgba(hsva)
    );

    this.hslaText = dHsla;
    this.rgbaText = dRgba;
    this.hexText = this.service.hexText(dRgba, this.alphaChannel === 'hex8');

    this.alphaSliderColor = `rgba(${dRgba.red},${dRgba.green},${dRgba.blue},${dRgba.alpha})`;
    this.hueSliderColor = `rgba(${hueRgba.red},${hueRgba.green},${hueRgba.blue},${rgba.alpha})`;

    if (this.format === 0 && this.hsva.alpha < 1 && this.alphaChannel === 'hex6') {
      this.format++;
    }

    this.service.outputFormat(
      this.hsva,
      this.outputFormat,
      this.alphaChannel === 'hex8');
    this.selectedColor = this.service.skyColorpickerOut(this.hsva);

    this.slider = new SliderPosition(
      (this.hsva.hue) * this.sliderDimMax.hue - 8,
      this.hsva.saturation * this.sliderDimMax.saturation - 8,
      (1 - this.hsva.value) * this.sliderDimMax.value - 8,
      this.hsva.alpha * this.sliderDimMax.alpha - 8);
  }

  private openPicker(): void {
    this.isPickerVisible = false;
    this.removePickerEventListeners();
    this.destroyOverlay();
    this.createOverlay();
    this.isOpen = true;
  }

  private sendMessage(type: SkyColorpickerMessageType) {
    this.messageStream.next({ type });
  }

  private handleIncomingMessages(message: SkyColorpickerMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkyColorpickerMessageType.Open:
        if (!this.isOpen) {
          this.openPicker();
        }
        break;

      case SkyColorpickerMessageType.Close:
        if (this.isOpen) {
          this.closePicker();
        }
        break;

      case SkyColorpickerMessageType.Reset:
        this.setColorFromString(this.initialColor);
        this.selectedColorChanged.emit(this.selectedColor);
        this.selectedColorApplied.emit({ color: this.selectedColor });
        break;

      case SkyColorpickerMessageType.ToggleResetButton:
        this.showResetButton = !this.showResetButton;
        break;
    }
  }

  private createAffixer(): void {
    const affixer = this.affixService.createAffixer(this.colorpickerRef);

    affixer.placementChange
      .pipe(takeUntil(this.pickerUnsubscribe))
      .subscribe((change) => {
        this.isPickerVisible = (change.placement !== null);
      });

    affixer.affixTo(this.triggerButtonRef.nativeElement, {
      autoFitContext: SkyAffixAutoFitContext.Viewport,
      enableAutoFit: true,
      horizontalAlignment: 'left',
      isSticky: true,
      placement: 'below'
    });

    this.affixer = affixer;
  }

  private destroyAffixer(): void {
    /*istanbul ignore else*/
    if (this.affixer) {
      this.affixer.destroy();
      this.affixer = undefined;
    }
  }

  private createOverlay(): void {
    const overlay = this.overlayService.create({
      enableClose: false,
      enablePointerEvents: false,
      enableScroll: true
    });

    overlay.attachTemplate(this.colorpickerTemplateRef);

    this.overlay = overlay;
  }

  private destroyOverlay(): void {
    /*istanbul ignore else*/
    if (this.overlay) {
      this.overlayService.close(this.overlay);
      this.overlay = undefined;
    }
  }

  private addTriggerButtonEventListeners(): void {
    fromEvent(window.document, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: KeyboardEvent) => {
        const key = event.key?.toLowerCase();
        /* istanbul ignore else */
        if (key === 'escape') {
          this.sendMessage(SkyColorpickerMessageType.Close);
        }
      });
  }

  private removePickerEventListeners(): void {
    /* istanbul ignore else */
    if (this.pickerUnsubscribe) {
      this.pickerUnsubscribe.next();
      this.pickerUnsubscribe.complete();
      this.pickerUnsubscribe = undefined;
    }
  }
}
