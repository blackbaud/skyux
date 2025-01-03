import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyCheckboxComponent } from '../checkbox/checkbox.component';
import { SkyRadioComponent } from '../radio/radio.component';

import { SkySelectionBoxAdapterService } from './selection-box-adapter.service';

/**
 * Creates a button to present users with a choice or question before proceeding with a one-time process.
 */
@Component({
  selector: 'sky-selection-box',
  styleUrls: ['./selection-box.component.scss'],
  templateUrl: './selection-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkySelectionBoxComponent implements OnDestroy {
  /**
   * The radio button or checkbox to display in the selection box.
   * @required
   */
  @Input()
  public set control(
    value: SkyCheckboxComponent | SkyRadioComponent | undefined,
  ) {
    this.#_control = value;
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#ngUnsubscribe = new Subject<void>();
    if (value) {
      this.#updateCheckedOnControlChange();
      this.#updateDisabledState();
    }
  }

  public get control(): SkyCheckboxComponent | SkyRadioComponent | undefined {
    return this.#_control;
  }

  public set checked(value: boolean) {
    this.#_checked = value;
    this.#changeDetector.markForCheck();
  }

  public get checked(): boolean {
    return this.#_checked;
  }

  public set disabled(value: boolean) {
    if (this.selectionBoxEl) {
      this.#selectionBoxAdapterService.setTabIndex(
        this.selectionBoxEl,
        value ? -1 : 0,
      );
    }
    this.#_disabled = value;
    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  @ViewChild('control', {
    read: ElementRef,
    static: false,
  })
  public controlEl: ElementRef | undefined;

  @ViewChild('selectionBox', {
    read: ElementRef,
    static: false,
  })
  public set selectionBoxEl(value: ElementRef | undefined) {
    this.#_selectionBoxEl = value;
    if (value) {
      this.#selectionBoxAdapterService.setTabIndex(
        value,
        this.disabled ? -1 : 0,
      );

      // Wait for child elements to render before overriding tabIndex values.
      // TODO: This logic is brittle since the checkbox/radio can set its own tab index
      // value at any time. We need a way to enforce the tab index for the entire lifespan of the component.
      setTimeout(() => {
        this.#selectionBoxAdapterService.setChildrenTabIndex(value, -1);
      });
    }
  }

  public get selectionBoxEl(): ElementRef | undefined {
    return this.#_selectionBoxEl;
  }

  #ngUnsubscribe = new Subject<void>();

  #_checked = false;

  #_control: SkyCheckboxComponent | SkyRadioComponent | undefined;

  #_disabled = false;

  #_selectionBoxEl: ElementRef | undefined;

  #changeDetector: ChangeDetectorRef;
  #selectionBoxAdapterService: SkySelectionBoxAdapterService;

  constructor(
    changeDetector: ChangeDetectorRef,
    selectionBoxAdapterService: SkySelectionBoxAdapterService,
  ) {
    this.#changeDetector = changeDetector;
    this.#selectionBoxAdapterService = selectionBoxAdapterService;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onKeydown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (event.key === ' ') {
      this.#selectControl();
      event.preventDefault();
    }
  }

  #selectControl(): void {
    if (this.controlEl) {
      this.#selectionBoxAdapterService.getControl(this.controlEl).click();
    }

    if (this.selectionBoxEl) {
      this.#selectionBoxAdapterService.focus(this.selectionBoxEl);
    }
  }

  #updateCheckedOnControlChange(): void {
    /* istanbul ignore else */
    if (this.control) {
      this.control.checkedChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          this.checked = value;
        });
    }
  }

  #updateDisabledState(): void {
    /* istanbul ignore else */
    if (this.control) {
      this.control.disabledChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          this.disabled = value;
        });
    }
  }
}
