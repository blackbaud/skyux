import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  SkyAffixAutoFitContext,
  SkyAffixer,
  SkyAffixService,
  SkyCoreAdapterService,
  SkyOverlayInstance,
  SkyOverlayService
} from '@skyux/core';

import {
  SkyInputBoxHostService
} from '@skyux/forms';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyTimepickerTimeOutput
} from './timepicker.interface';

import * as moment_ from 'moment';
const moment = moment_;

let nextId = 0;

/**
 * Creates a SKY UX-themed replacement for the HTML `input` element with `type="time"`.
 * The value that users select is driven through the `ngModel` attribute
 * specified on the `input` element. You must wrap this component around an `input`
 * with the `skyTimepickerInput` directive.
 */
@Component({
  selector: 'sky-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTimepickerComponent implements OnInit, OnDestroy {

  /**
   * Fires when the value in the timepicker input changes.
   */
  @Output()
  public selectedTimeChanged: EventEmitter<SkyTimepickerTimeOutput> =
    new EventEmitter<SkyTimepickerTimeOutput>();

  public set disabled(value: boolean) {
    this._disabled = value;
    this.changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public set selectedHour(setHour: number) {
    let hour: number;
    let hourOffset: number = 0;
    if (this.selectedMeridies === 'AM' && setHour === 12) { hourOffset = -12; }
    if (this.selectedMeridies === 'PM' && setHour !== 12) { hourOffset = 12; }
    if (this.is8601) { hourOffset = 0; }
    hour = moment({ 'hour': setHour }).add(hourOffset, 'hours').hour();

    this.activeTime = moment({
      'hour': hour,
      'minute': moment(this.activeTime).get('minute') + 0
    }).toDate();
    this.selectedTimeChanged.emit(this.selectedTime);
  }

  public get selectedHour(): number {
    if (!this.is8601) {
      /* istanbul ignore next */
      return parseInt(moment(this.activeTime).format('h'), 0) || 1;
    }
    /* istanbul ignore else */
    if (this.is8601) {
      return moment(this.activeTime).hour() + 0;
    }
  }

  public set selectedMeridies(meridies: string) {
    /* istanbul ignore else */
    if (!this.is8601) {
      if (meridies.trim() !== this.selectedMeridies) {
        this.activeTime = moment(this.activeTime).add(12, 'hours').toDate();
        this.selectedTimeChanged.emit(this.selectedTime);
      }
    }
  }

  public get selectedMeridies(): string {
    if (this.activeTime) {
      return moment(this.activeTime).format('A');
    }
    return '';
  }

  public set selectedMinute(minute: number) {
    this.activeTime = moment({
      'hour': moment(this.activeTime).get('hour') + 0,
      'minute': minute
    }).toDate();
    this.selectedTimeChanged.emit(this.selectedTime);
  }

  public get selectedMinute(): number {
    return moment(this.activeTime).minute() + 0;
  }

  public set selectedTime(newTime: SkyTimepickerTimeOutput) {
    if (typeof newTime !== 'undefined') {
      /* sanity check */
      /* istanbul ignore else */
      if (newTime.local !== 'Invalid date') {
        this.activeTime = newTime.iso8601;
        this.changeDetector.markForCheck();
      }
    }
  }

  public get selectedTime(): SkyTimepickerTimeOutput {
    const time: SkyTimepickerTimeOutput = {
      hour: moment(this.activeTime).hour(),
      minute: moment(this.activeTime).minute(),
      meridie: moment(this.activeTime).format('A'),
      timezone: parseInt(moment(this.activeTime).format('Z'), 10),
      iso8601: this.activeTime,
      local: moment(this.activeTime).format(this.localeFormat),
      customFormat: (typeof this.returnFormat !== 'undefined')
        ? this.returnFormat : this.localeFormat
    };

    return time;
  }

  public activeTime: Date;

  public hours: Array<number>;

  public is8601: boolean = false;

  public isOpen: boolean;

  public isVisible: boolean;

  public localeFormat: string;

  public minutes: Array<number>;

  public minuteMultiplier: number;

  public returnFormat: string;

  public timeFormat: string = 'hh';

  public timepickerId: string;

  public triggerButtonId: string;

  @ViewChild('timepickerRef', {
    read: ElementRef
  })
  private set timepickerRef(value: ElementRef) {
    if (value) {
      this._timepickerRef = value;

      // Wait for the timepicker component to render before guaging dimensions.
      setTimeout(() => {
        this.destroyAffixer();
        this.createAffixer();

        setTimeout(() => {
          this.coreAdapter.getFocusableChildrenAndApplyFocus(
            this.timepickerRef,
            '.sky-timepicker-content',
            false
          );

          this.isVisible = true;
          this.changeDetector.markForCheck();
        });
      });
    }
  }

  private get timepickerRef(): ElementRef {
    return this._timepickerRef;
  }

  @ViewChild('timepickerTemplateRef', {
    read: TemplateRef
  })
  private timepickerTemplateRef: TemplateRef<any>;

  @ViewChild('triggerButtonRef', {
    read: ElementRef
  })
  private triggerButtonRef: ElementRef;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private inputTemplateRef: TemplateRef<any>;

  @ViewChild('triggerButtonTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private triggerButtonTemplateRef: TemplateRef<any>;

  private affixer: SkyAffixer;

  private timepickerUnsubscribe: Subject<void>;

  private ngUnsubscribe = new Subject();

  private overlay: SkyOverlayInstance;

  private _disabled: boolean;

  private _timepickerRef: ElementRef;

  constructor(
    private affixService: SkyAffixService,
    private changeDetector: ChangeDetectorRef,
    private coreAdapter: SkyCoreAdapterService,
    private overlayService: SkyOverlayService,
    @Optional() public inputBoxHostService?: SkyInputBoxHostService,
    @Optional() themeSvc?: SkyThemeService
  ) {
    const uniqueId = nextId++;
    this.timepickerId = `sky-timepicker-${uniqueId}`;
    this.triggerButtonId = `sky-timepicker-button-${uniqueId}`;

    // Update icons when theme changes.
    themeSvc?.settingsChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeDetector.markForCheck();
      });
  }

  public ngOnInit(): void {
    this.setFormat(this.timeFormat);
    this.addTriggerButtonEventListeners();

    if (this.inputBoxHostService) {
      this.inputBoxHostService.populate(
        {
          inputTemplate: this.inputTemplateRef,
          buttonsTemplate: this.triggerButtonTemplateRef
        }
      );
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.removePickerEventListeners();
    this.destroyAffixer();
    this.destroyOverlay();
  }

  public setFormat(format: string): void {
    let h: number = 12;
    let m: number = 12;
    let minuteMultiplier: number = 5;
    let localeFormat: string = 'h:mm A';
    if (format === 'hh') {
      h = 12;
      m = 12;
      minuteMultiplier = 5;
      localeFormat = 'h:mm A';
      this.is8601 = false;
    }
    if (format === 'HH') {
      h = 24;
      m = 4;
      minuteMultiplier = 15;
      localeFormat = 'HH:mm';
      this.is8601 = true;
    }
    let data: {
      'hours': Array<number>,
      'minutes': Array<number>,
      'localeFormat': string,
      'minuteMultiplier': number
    };

    data = {
      'hours': Array.apply(undefined, Array(h))
        .map(function (x: number, i: number) {
          if (format === 'hh') { return ++i; }
          /* istanbul ignore else */
          if (format === 'HH') { return i; }
          /* istanbul ignore next */
          /* sanity check */
          return 0;
        }),
      'minutes': Array.apply(undefined, Array(m))
        .map(function (x: number, i: number) {
          return i * minuteMultiplier;
        }),
      'localeFormat': localeFormat,
      'minuteMultiplier': minuteMultiplier
    };

    this.hours = data.hours;
    this.minutes = data.minutes;
    this.localeFormat = data.localeFormat;
    this.minuteMultiplier = data.minuteMultiplier;
  }

  public onCloseButtonCick(): void {
    this.closePicker();
  }

  public setTime(event: any): void {
    /* istanbul ignore else */
    if (typeof event !== 'undefined') {
      /* istanbul ignore else */
      if (event.type === 'click') {
        event.stopPropagation();
        if (event.target.name === 'hour') {
          this.selectedHour = parseInt(event.target.innerHTML, 0);
        }
        if (event.target.name === 'minute') {
          this.selectedMinute = parseInt(event.target.innerHTML, 0);
        }
        if (event.target.name === 'meridie') {
          this.selectedMeridies = event.target.innerHTML;
        }
      }
    }
  }

  public onTriggerButtonClick(): void {
    this.openPicker();
  }

  private closePicker() {
    this.destroyAffixer();
    this.destroyOverlay();
    this.removePickerEventListeners();
    this.triggerButtonRef.nativeElement.focus();
    this.isOpen = false;
  }

  private openPicker(): void {
    this.isVisible = false;
    this.changeDetector.markForCheck();

    this.removePickerEventListeners();
    this.timepickerUnsubscribe = new Subject<void>();
    this.destroyOverlay();
    this.createOverlay();

    this.isOpen = true;
    this.changeDetector.markForCheck();
  }

  private createAffixer(): void {
    const affixer = this.affixService.createAffixer(this.timepickerRef);

    // Hide timepicker when trigger button is scrolled off screen.
    affixer.placementChange
      .pipe(takeUntil(this.timepickerUnsubscribe))
      .subscribe((change) => {
        this.isVisible = (change.placement !== null);
        this.changeDetector.markForCheck();
      });

    affixer.affixTo(this.triggerButtonRef.nativeElement, {
      autoFitContext: SkyAffixAutoFitContext.Viewport,
      enableAutoFit: true,
      horizontalAlignment: 'right',
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
      enablePointerEvents: false
    });

    overlay.backdropClick
      .pipe(takeUntil(this.timepickerUnsubscribe))
      .subscribe(() => {
        if (this.isOpen) {
          this.closePicker();
        }
      });

    overlay.attachTemplate(this.timepickerTemplateRef);

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
        if (key === 'escape' && this.isOpen) {
          this.closePicker();
        }
      });
  }

  private removePickerEventListeners(): void {
    /* istanbul ignore else */
    if (this.timepickerUnsubscribe) {
      this.timepickerUnsubscribe.next();
      this.timepickerUnsubscribe.complete();
      this.timepickerUnsubscribe = undefined;
    }
  }
}
