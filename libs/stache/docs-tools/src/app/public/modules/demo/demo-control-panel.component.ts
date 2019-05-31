import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';

import {
  merge,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyDocsDemoControlPanelCheckboxComponent
} from './demo-control-panel-checkbox.component';

import {
  SkyDocsDemoControlPanelRadioGroupComponent
} from './demo-control-panel-radio-group.component';

import {
  SkyDocsDemoControlPanelChange
} from './demo-control-panel-change';

@Component({
  selector: 'sky-docs-demo-control-panel',
  templateUrl: './demo-control-panel.component.html',
  styleUrls: ['./demo-control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoControlPanelComponent implements OnDestroy, AfterContentInit {

  @Output()
  public selectionChange = new EventEmitter<SkyDocsDemoControlPanelChange>();

  @ContentChildren(SkyDocsDemoControlPanelRadioGroupComponent, { descendants: true })
  private radioGroups: QueryList<SkyDocsDemoControlPanelRadioGroupComponent>;

  @ContentChildren(SkyDocsDemoControlPanelCheckboxComponent, { descendants: true })
  private checkboxes: QueryList<SkyDocsDemoControlPanelCheckboxComponent>;

  private ngUnsubscribe = new Subject<boolean>();

  public ngAfterContentInit(): void {
    merge(
      ...this.checkboxes.map(c => c.selectionChange),
      ...this.radioGroups.map(c => c.selectionChange)
    )
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((change: SkyDocsDemoControlPanelChange) => {
        this.selectionChange.next(change);
      });
  }

  public ngOnDestroy(): void {
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
  }

}
