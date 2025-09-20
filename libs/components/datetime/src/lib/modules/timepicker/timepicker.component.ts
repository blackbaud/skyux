import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  SKY_STACKING_CONTEXT,
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyCoreAdapterService,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyStackingContext,
} from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyThemeService } from '@skyux/theme';

import moment from 'moment';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTimepickerTimeFormatType } from './timepicker-time-format-type';
import { SkyTimepickerTimeOutput } from './timepicker-time-output';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyTimepickerComponent implements OnInit, OnDestroy {
  /**
   * Fires when the value in the timepicker input changes.
   */
  @Output()
  public selectedTimeChanged: EventEmitter<SkyTimepickerTimeOutput> =
    new EventEmitter<SkyTimepickerTimeOutput>();

  public set disabled(value: boolean) {
    this.#_disabled = value;
    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public set selectedHour(setHour: number) {
    let hourOffset = 0;
    if (this.selectedMeridies === 'AM' && setHour === 12) {
      hourOffset = -12;
    }
    if (this.selectedMeridies === 'PM' && setHour !== 12) {
      hourOffset = 12;
    }
    if (this.is8601) {
      hourOffset = 0;
    }
    const hour = moment({ hour: setHour }).add(hourOffset, 'hours').hour();

    this.activeTime = moment({
      hour: hour,
      minute: moment(this.activeTime).get('minute') + 0,
    }).toDate();
    this.selectedTimeChanged.emit(this.selectedTime);
  }

  public get selectedHour(): number {
    if (!this.is8601) {
      /* istanbul ignore next */
      return parseInt(moment(this.activeTime).format('h'), 0) || 1;
    } else {
      return moment(this.activeTime).hour() + 0;
    }
  }

  public set selectedMeridies(meridies: string) {
    meridies = meridies.trim();
    /* istanbul ignore else */
    if (meridies !== this.selectedMeridies) {
      switch (meridies) {
        case 'AM':
          this.activeTime = moment(this.activeTime)
            .subtract(12, 'hours')
            .toDate();
          break;

        case 'PM':
          this.activeTime = moment(this.activeTime).add(12, 'hours').toDate();
          break;
      }
      this.selectedTimeChanged.emit(this.selectedTime);
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
      hour: moment(this.activeTime).get('hour') + 0,
      minute: minute,
    }).toDate();
    this.selectedTimeChanged.emit(this.selectedTime);
  }

  public get selectedMinute(): number {
    return moment(this.activeTime).minute() + 0;
  }

  public set selectedTime(newTime: SkyTimepickerTimeOutput | undefined) {
    if (typeof newTime !== 'undefined') {
      /* sanity check */
      /* istanbul ignore else */
      if (newTime.local !== 'Invalid date') {
        this.activeTime = newTime.iso8601;
        this.#changeDetector.markForCheck();
      }
    }
  }

  public get selectedTime(): SkyTimepickerTimeOutput | undefined {
    const time: SkyTimepickerTimeOutput = {
      hour: moment(this.activeTime).hour(),
      minute: moment(this.activeTime).minute(),
      meridie: moment(this.activeTime).format('A'),
      timezone: parseInt(moment(this.activeTime).format('Z'), 10),
      iso8601: this.activeTime,
      local: moment(this.activeTime).format(this.localeFormat),
      customFormat:
        typeof this.returnFormat !== 'undefined'
          ? this.returnFormat
          : this.localeFormat,
    };

    return time;
  }

  public activeTime: Date = new Date();

  public hours: number[] = [];

  public is8601 = false;

  public isOpen = false;

  public isVisible = false;

  public localeFormat = 'h:mm A';

  public minutes: number[] = [];

  public minuteMultiplier: number | undefined;

  public returnFormat: string | undefined;

  public timeFormat: SkyTimepickerTimeFormatType = 'hh';

  public timepickerId: string;

  public triggerButtonId: string;

  @ViewChild('timepickerRef', { read: ElementRef })
  public set timepickerRef(value: ElementRef | undefined) {
    if (value) {
      this.#_timepickerRef = value;

      this.#addKeyupListener();

      // Wait for the timepicker component to render before gauging dimensions.
      setTimeout(() => {
        this.#destroyAffixer();
        this.#createAffixer();

        setTimeout(() => {
          if (this.timepickerRef) {
            this.#coreAdapter.getFocusableChildrenAndApplyFocus(
              this.timepickerRef,
              '.sky-timepicker-content',
              false,
            );
          }

          this.isVisible = true;
          this.#changeDetector.markForCheck();
        });
      });
    }
  }

  public get timepickerRef(): ElementRef | undefined {
    return this.#_timepickerRef;
  }

  @ViewChild('timepickerTemplateRef', { read: TemplateRef })
  public timepickerTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButtonRef', { read: ElementRef })
  public triggerButtonRef: ElementRef | undefined;

  @ViewChild('inputTemplateRef', { read: TemplateRef, static: true })
  public inputTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButtonTemplateRef', { read: TemplateRef, static: true })
  public triggerButtonTemplateRef: TemplateRef<unknown> | undefined;

  #affixer: SkyAffixer | undefined;

  #timepickerUnsubscribe = new Subject<void>();

  #ngUnsubscribe = new Subject<void>();

  #overlay: SkyOverlayInstance | undefined;

  #overlayKeyupListener: Subscription | undefined;

  #_disabled = false;

  #_timepickerRef: ElementRef | undefined;

  #affixService: SkyAffixService;
  #changeDetector: ChangeDetectorRef;
  #coreAdapter: SkyCoreAdapterService;
  readonly #environmentInjector = inject(EnvironmentInjector);
  #overlayService: SkyOverlayService;
  #zIndex: Observable<number> | undefined;

  constructor(
    affixService: SkyAffixService,
    changeDetector: ChangeDetectorRef,
    coreAdapter: SkyCoreAdapterService,
    overlayService: SkyOverlayService,
    @Optional() public inputBoxHostService?: SkyInputBoxHostService,
    @Optional() themeSvc?: SkyThemeService,
    @Optional()
    @Inject(SKY_STACKING_CONTEXT)
    stackingContext?: SkyStackingContext,
  ) {
    this.#affixService = affixService;
    this.#changeDetector = changeDetector;
    this.#coreAdapter = coreAdapter;
    this.#overlayService = overlayService;
    this.#zIndex = stackingContext?.zIndex;

    const uniqueId = nextId++;
    this.timepickerId = `sky-timepicker-${uniqueId}`;
    this.triggerButtonId = `sky-timepicker-button-${uniqueId}`;

    // Update icons when theme changes.
    themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnInit(): void {
    this.setFormat(this.timeFormat);
    this.#addKeyupListener();

    if (this.inputBoxHostService && this.inputTemplateRef) {
      this.inputBoxHostService.populate({
        inputTemplate: this.inputTemplateRef,
        buttonsTemplate: this.triggerButtonTemplateRef,
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

  public setFormat(format: SkyTimepickerTimeFormatType): void {
    let h = 12;
    let m = 12;
    let minuteMultiplier = 5;
    let localeFormat = 'h:mm A';
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

    const data: {
      hours: number[];
      minutes: number[];
      localeFormat: string;
      minuteMultiplier: number;
    } = {
      // Create a sparse array with a length equal to the hour.
      hours: Array(...Array(h)).map((_, i) => {
        if (format === 'hh') {
          return ++i;
        }
        /* istanbul ignore else */
        if (format === 'HH') {
          return i;
        }
        /* istanbul ignore next */
        /* sanity check */
        return 0;
      }),
      // Create a sparse array with a length equal to the minute.
      minutes: Array(...Array(m)).map(function (_, i) {
        return i * minuteMultiplier;
      }),
      localeFormat: localeFormat,
      minuteMultiplier: minuteMultiplier,
    };

    this.hours = data.hours;
    this.minutes = data.minutes;
    this.localeFormat = data.localeFormat;
    this.minuteMultiplier = data.minuteMultiplier;
  }

  public onCloseButtonClick(): void {
    this.#closePicker();
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
    this.#openPicker();
  }

  protected highlightMinute(selectedMinute: number, minute: number): boolean {
    const radix = this.is8601 ? 15 : 5;
    return Math.floor(selectedMinute / radix) === minute / radix;
  }

  #closePicker(): void {
    this.#destroyAffixer();
    this.#destroyOverlay();
    this.#removePickerEventListeners();
    this.triggerButtonRef?.nativeElement.focus();
    this.isOpen = false;
  }

  #openPicker(): void {
    this.isVisible = false;
    this.#changeDetector.markForCheck();

    this.#removePickerEventListeners();
    this.#destroyOverlay();
    this.#createOverlay();

    this.isOpen = true;
    this.#changeDetector.markForCheck();
  }

  #createAffixer(): void {
    if (this.timepickerRef && this.triggerButtonRef) {
      const affixer = this.#affixService.createAffixer(this.timepickerRef);

      // Hide timepicker when trigger button is scrolled off screen.
      affixer.placementChange
        .pipe(takeUntil(this.#timepickerUnsubscribe))
        .subscribe((change) => {
          this.isVisible = change.placement !== null;
          this.#changeDetector.markForCheck();
        });

      affixer.affixTo(this.triggerButtonRef.nativeElement, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: 'right',
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
    if (this.timepickerTemplateRef) {
      const overlay = this.#overlayService.create({
        enableClose: false,
        enablePointerEvents: false,
        environmentInjector: this.#environmentInjector,
      });

      if (this.#zIndex) {
        this.#zIndex
          .pipe(takeUntil(this.#timepickerUnsubscribe))
          .subscribe((zIndex) => {
            overlay.componentRef.instance.zIndex = zIndex.toString(10);
          });
      }

      overlay.backdropClick
        .pipe(takeUntil(this.#timepickerUnsubscribe))
        .subscribe(() => {
          /* istanbul ignore else */
          if (this.isOpen) {
            this.#closePicker();
          }
        });

      overlay.attachTemplate(this.timepickerTemplateRef);

      this.#overlay = overlay;
    }
  }

  #destroyOverlay(): void {
    /*istanbul ignore else*/
    if (this.#overlay) {
      this.#overlayService.close(this.#overlay);
      this.#overlay = undefined;
    }
  }

  #addKeyupListener(): void {
    const timepickerMenuElement = this.timepickerRef?.nativeElement;

    if (timepickerMenuElement) {
      this.#overlayKeyupListener = fromEvent<KeyboardEvent>(
        timepickerMenuElement,
        'keyup',
      )
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((event) => {
          const key = event.key?.toLowerCase();
          /* istanbul ignore else */
          if (key === 'escape' && this.isOpen) {
            this.#closePicker();
            event.stopPropagation();
            event.preventDefault();
          }
        });
    }
  }

  #removePickerEventListeners(): void {
    /* istanbul ignore else */
    if (this.#timepickerUnsubscribe) {
      this.#timepickerUnsubscribe.next();
      this.#timepickerUnsubscribe.complete();
      this.#timepickerUnsubscribe = new Subject<void>();
    }
    /* istanbul ignore next */
    this.#overlayKeyupListener?.unsubscribe();
  }
}
