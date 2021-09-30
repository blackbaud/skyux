import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyCheckboxComponent
} from '../checkbox/checkbox.component';

import {
  SkyRadioComponent
} from '../radio/radio.component';

import {
  SkySelectionBoxAdapterService
} from './selection-box-adapter.service';

/**
 * Creates a button to present users with a choice or question before proceeding with a one-time process.
 */
@Component({
  selector: 'sky-selection-box',
  styleUrls: ['./selection-box.component.scss'],
  templateUrl: './selection-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkySelectionBoxComponent implements AfterViewInit, OnDestroy {

  /**
   * Specifies the radio button or checkbox to display in the selection box.
   * @required
   */
  @Input()
  public control: SkyCheckboxComponent | SkyRadioComponent;

  public set checked(value: boolean) {
    this._checked = value;
    this.changeDetector.markForCheck();
  }

  public get checked(): boolean {
    return this._checked;
  }

  public set disabled(value: boolean) {
    this.selectionBoxAdapterService.setTabIndex(this.selectionBoxEl, value ? -1 : 0);
    this._disabled = value;
    this.changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  @ViewChild('control', {
    read: ElementRef,
    static: false
  })
  private controlEl: ElementRef;

  @ViewChild('selectionBox', {
    read: ElementRef,
    static: false
  })
  private selectionBoxEl: ElementRef;

  private ngUnsubscribe = new Subject<void>();

  private _checked: boolean;

  private _disabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private selectionBoxAdapterService: SkySelectionBoxAdapterService
  ) {}

  public ngAfterViewInit(): void {
    // Wait for consumer form controls to initialize before setting selected/disabled states.
    setTimeout(() => {
      this.selectionBoxAdapterService.setChildrenTabIndex(this.selectionBoxEl, -1);
      this.updateCheckedOnControlChange();
      this.updateDisabledState();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Since we are programatically firing a click on the control,
   * make sure user is not clicking on the control before firing click logic.
   */
  public onClick(event: any): void {
    const isControlClick =
      this.selectionBoxAdapterService.isDescendant(this.controlEl, event.target);
    if (!isControlClick) {
      this.selectControl();
    }
  }

  public onKeydown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (event.key === ' ') {
      this.selectControl();
      event.preventDefault();
    }
  }

  private selectControl(): void {
    this.selectionBoxAdapterService.getControl(this.controlEl).click();
    this.selectionBoxAdapterService.focus(this.selectionBoxEl);
  }

  private updateCheckedOnControlChange(): void {
    this.control.checkedChange
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe((value) => {
        this.checked = value;
    });
  }

  private updateDisabledState(): void {
    this.control.disabledChange
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe((value) => {
        this.disabled = value;
    });
  }
}
