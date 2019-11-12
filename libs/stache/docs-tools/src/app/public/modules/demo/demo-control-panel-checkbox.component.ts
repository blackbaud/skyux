import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDocsDemoControlPanelChange
} from './demo-control-panel-change';

/**
 * Renders a checkbox control within the control panel.
 * @example
 * ```markup
 * <sky-docs-demo-control-panel-checkbox
 *   label="Show title"
 *   [checked]="true"
 *   [propertyName]="showTitle"
 * >
 * </sky-docs-demo-control-panel-checkbox>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-control-panel-checkbox',
  templateUrl: './demo-control-panel-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoControlPanelCheckboxComponent implements OnInit, OnDestroy {

  /**
   * The checked status of the checkbox.
   * @default false
   */
  @Input()
  public set checked(value: boolean) {
    if (value !== undefined && this._checked === undefined) {
      this.initialState.checked = value;
    }

    this._checked = value;
  }

  public get checked(): boolean {
    return this._checked || false;
  }

  /**
   * The text label of the checkbox.
   * @required
   */
  @Input()
  public label: string;

  /**
   * The name of the property (or setting) that is affected by this control.
   * @required
   */
  @Input()
  public propertyName: string;

  public selectionChange = new Subject<SkyDocsDemoControlPanelChange>();

  private initialState: {
    checked?: boolean;
  } = {};

  private _checked: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    setTimeout(() => {
      this.notifyChange();
    });
  }

  public ngOnDestroy(): void {
    this.selectionChange.complete();
  }

  public onModelChange(): void {
    this.notifyChange();
  }

  public resetState(): void {
    this.checked = !!this.initialState.checked;
    this.changeDetector.markForCheck();
  }

  private notifyChange(): void {
    this.selectionChange.next({
      [this.propertyName]: this.checked
    });
  }

}
