import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';

import { merge, Subject, Subscription } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { SkyDocsDemoControlPanelCheckboxComponent } from './demo-control-panel-checkbox.component';

import { SkyDocsDemoControlPanelRadioGroupComponent } from './demo-control-panel-radio-group.component';

import { SkyDocsDemoControlPanelChange } from './demo-control-panel-change';

/**
 * Handles the appearance and configuration of the behavior demo control panel.
 * @example
 * ```markup
 * <sky-docs-demo-control-panel
 *   (selectionChange)="onSelectionChange($event)"
 * >
 *   Control panel content here.
 * </sky-docs-demo-control-panel>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-control-panel',
  templateUrl: './demo-control-panel.component.html',
  styleUrls: ['./demo-control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsDemoControlPanelComponent
  implements OnDestroy, AfterContentInit
{
  /**
   * Fires when the user clicks the reset button.
   */
  @Output()
  /*eslint-disable-next-line @angular-eslint/no-output-native */
  public reset = new EventEmitter<void>();

  /**
   * Fires when a user makes a selection from one of the controls in the panel.
   */
  @Output()
  public selectionChange = new EventEmitter<SkyDocsDemoControlPanelChange>();

  @ContentChildren(SkyDocsDemoControlPanelRadioGroupComponent, {
    descendants: true,
  })
  private radioGroups: QueryList<SkyDocsDemoControlPanelRadioGroupComponent>;

  @ContentChildren(SkyDocsDemoControlPanelCheckboxComponent, {
    descendants: true,
  })
  private checkboxes: QueryList<SkyDocsDemoControlPanelCheckboxComponent>;

  private eventListeners: Subscription;
  private ngUnsubscribe = new Subject<boolean>();

  public ngAfterContentInit(): void {
    this.addEventListeners();

    merge(this.checkboxes.changes, this.radioGroups.changes)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.addEventListeners();
      });
  }

  public ngOnDestroy(): void {
    this.reset.complete();
    this.selectionChange.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onResetButtonClick(): void {
    this.radioGroups.forEach((radioGroup) => {
      radioGroup.resetValue();
    });

    this.checkboxes.forEach((checkbox) => {
      checkbox.resetState();
    });

    this.reset.emit();
  }

  private addEventListeners(): void {
    if (this.eventListeners) {
      this.eventListeners.unsubscribe();
    }

    this.eventListeners = merge(
      ...this.checkboxes.map((c) => c.selectionChange),
      ...this.radioGroups.map((c) => c.selectionChange)
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change) => {
        this.selectionChange.next(change);
      });
  }
}
