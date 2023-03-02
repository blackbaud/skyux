import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
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

import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { SkyDatepickerCalendarChange } from './datepicker-calendar-change';
import { SkyDatepickerCalendarComponent } from './datepicker-calendar.component';
import { SkyDatepickerCustomDate } from './datepicker-custom-date';

let nextId = 0;

/**
 * Creates the datepicker button and calendar.
 * You must wrap this component around an input with the `skyDatepickerInput` directive.
 */
@Component({
  selector: 'sky-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDatepickerComponent implements OnDestroy, OnInit {
  /**
   * Adds a class to the datepicker.
   * @default ""
   */
  @Input()
  public pickerClass: string | undefined = '';

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
    this.#changeDetector.markForCheck();
  }

  public set selectedDate(value: Date | undefined) {
    this.#_selectedDate = value;
    if (this.calendar) {
      this.calendar.writeValue(value);
    }
  }

  public get selectedDate(): Date | undefined {
    return this.#_selectedDate;
  }

  /**
   * Fires when the range of displayed dates in the calendar changes. Provides the
   * current range of displayed dates and a mutable `customDate` property consumers can use
   * to modify individual dates on the calendar.
   */
  @Output()
  public calendarDateRangeChange = new EventEmitter<SkyDatepickerCalendarChange>();

  public calendarId: string;

  public customDates: SkyDatepickerCustomDate[] | undefined;

  public dateChange = new EventEmitter<Date>();

  public isDaypickerWaiting = false;

  public isOpen = false;

  public isVisible = false;

  public maxDate: Date | undefined;

  public minDate: Date | undefined;

  public startingDay: number | undefined;

  public triggerButtonId: string;

  @ViewChild(SkyDatepickerCalendarComponent)
  public calendar: SkyDatepickerCalendarComponent | undefined;

  @ViewChild('calendarRef', {
    read: ElementRef,
  })
  public set calendarRef(value: ElementRef | undefined) {
    if (value) {
      this.#_calendarRef = value;

      // Wait for the calendar component to render before gauging dimensions.
      setTimeout(() => {
        if (this.calendarRef) {
          this.calendar?.writeValue(this.selectedDate);

          this.#destroyAffixer();
          this.#createAffixer();

          setTimeout(() => {
            if (this.calendarRef) {
              this.#coreAdapter.getFocusableChildrenAndApplyFocus(
                this.calendarRef,
                '.sky-datepicker-calendar-inner',
                false
              );

              this.isVisible = true;
              this.#changeDetector.markForCheck();
            }
          });
        }
      });
    }
  }

  public get calendarRef(): ElementRef | undefined {
    return this.#_calendarRef;
  }

  @ViewChild('calendarTemplateRef', {
    read: TemplateRef,
  })
  public calendarTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButtonRef', {
    read: ElementRef,
  })
  public triggerButtonRef: ElementRef | undefined;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButtonTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public triggerButtonTemplateRef: TemplateRef<unknown> | undefined;

  #affixer: SkyAffixer | undefined;

  #calendarUnsubscribe: Subject<void> = new Subject<void>();

  #customDatesSubscription: Subscription | undefined;

  #ngUnsubscribe = new Subject<void>();

  #overlay: SkyOverlayInstance | undefined;

  #overlayKeydownListener: Subscription | undefined;

  #_calendarRef: ElementRef | undefined;

  #_disabled: boolean | undefined = false;

  #_selectedDate: Date | undefined;

  #affixService: SkyAffixService;
  #changeDetector: ChangeDetectorRef;
  #coreAdapter: SkyCoreAdapterService;
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
    stackingContext?: SkyStackingContext
  ) {
    this.#affixService = affixService;
    this.#changeDetector = changeDetector;
    this.#coreAdapter = coreAdapter;
    this.#overlayService = overlayService;
    const uniqueId = nextId++;
    this.calendarId = `sky-datepicker-calendar-${uniqueId}`;
    this.triggerButtonId = `sky-datepicker-button-${uniqueId}`;
    this.#zIndex = stackingContext?.zIndex;

    // Update icons when theme changes.
    themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnInit(): void {
    if (this.inputBoxHostService && this.inputTemplateRef) {
      this.inputBoxHostService.populate({
        inputTemplate: this.inputTemplateRef,
        buttonsTemplate: this.triggerButtonTemplateRef,
      });
    }
  }

  public ngOnDestroy(): void {
    this.dateChange.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#removePickerEventListeners();
    this.#destroyAffixer();
    this.#destroyOverlay();
  }

  public onCalendarModeChange(): void {
    // Let the calendar populate in the DOM before recalculating placement.
    setTimeout(() => {
      this.#affixer?.reaffix();
    });
  }

  public onSelectedDateChange(value: Date): void {
    this.dateChange.emit(value);
    this.#closePicker();
  }

  public onTriggerButtonClick(): void {
    if (this.isOpen) {
      this.#closePicker();
    } else {
      this.#openPicker();
    }
  }

  public onCalendarDateRangeChange(event?: SkyDatepickerCalendarChange): void {
    /* istanbul ignore else */
    if (event) {
      this.#cancelCustomDatesSubscription();

      const args: SkyDatepickerCalendarChange = {
        startDate: event.startDate,
        endDate: event.endDate,
        customDates: undefined,
      };
      this.calendarDateRangeChange.emit(args);
      // If consumer has added an observable to the args, watch for incoming custom dates.
      /* istanbul ignore else */
      if (args.customDates) {
        this.isDaypickerWaiting = true;
        // Avoid an ExpressionChangedAfterItHasBeenCheckedError.
        this.#changeDetector.detectChanges();

        this.#customDatesSubscription = args.customDates
          .pipe(debounceTime(250))
          .subscribe((result) => {
            this.customDates = result;
            this.isDaypickerWaiting = false;

            // Trigger change detection in child components to show changes in the calendar.
            this.#changeDetector.markForCheck();
          });
      } else {
        // If consumer returns an undefined value after custom dates have
        // already ben established, remove custom dates.
        if (this.customDates) {
          this.customDates = undefined;
          // Avoid an ExpressionChangedAfterItHasBeenCheckedError.
          this.#changeDetector.detectChanges();
        }
      }
    }
  }

  #closePicker() {
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
    if (this.calendarRef && this.triggerButtonRef) {
      const affixer = this.#affixService.createAffixer(this.calendarRef);

      // Hide calendar when trigger button is scrolled off screen.
      affixer.placementChange
        .pipe(takeUntil(this.#calendarUnsubscribe))
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
    if (this.calendarTemplateRef) {
      const overlay = this.#overlayService.create({
        wrapperClass: this.pickerClass,
        enableClose: false,
        enablePointerEvents: false,
      });

      if (this.#zIndex) {
        this.#zIndex
          .pipe(takeUntil(this.#calendarUnsubscribe))
          .subscribe((zIndex) => {
            overlay.componentRef.instance.zIndex = zIndex.toString(10);
          });
      }

      overlay.backdropClick
        .pipe(takeUntil(this.#calendarUnsubscribe))
        .subscribe(() => {
          /* istanbul ignore else */
          if (this.isOpen) {
            this.#closePicker();
          }
        });

      this.#addKeydownListener();

      overlay.attachTemplate(this.calendarTemplateRef);

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

  #addKeydownListener(): void {
    this.#overlayKeydownListener = fromEvent<KeyboardEvent>(
      window.document,
      'keydown'
    )
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        const key = event.key?.toLowerCase();
        if (key === 'escape' && this.isOpen) {
          this.#closePicker();
        }
      });
  }

  #removePickerEventListeners(): void {
    this.#calendarUnsubscribe.next();
    this.#calendarUnsubscribe.complete();
    this.#calendarUnsubscribe = new Subject<void>();
    this.#overlayKeydownListener?.unsubscribe();
  }

  #cancelCustomDatesSubscription(): void {
    if (this.#customDatesSubscription) {
      this.#customDatesSubscription.unsubscribe();
      this.#customDatesSubscription = undefined;
    }
  }
}
