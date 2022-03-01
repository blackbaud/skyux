import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SkyBackToTopMessage, SkyBackToTopMessageType } from '@skyux/layout';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from './data-manager.service';

/**
 * The top-level data manager component. Provide `SkyDataManagerService` at this level.
 */
@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataManagerComponent implements OnDestroy, OnInit {
  public get currentViewkeeperClasses(): string[] {
    const dataManagerClasses = ['.sky-data-manager-toolbar'];
    let allClasses = dataManagerClasses;

    if (this._currentViewkeeperClasses) {
      allClasses = dataManagerClasses.concat(this._currentViewkeeperClasses);
    }

    return allClasses;
  }

  public set currentViewkeeperClasses(value: string[]) {
    this._currentViewkeeperClasses = value;
    this.changeDetection.markForCheck();
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public set isInitialized(value: boolean) {
    this._isInitialized = value;
    this.changeDetection.markForCheck();
  }

  public backToTopController = new Subject<SkyBackToTopMessage>();

  public backToTopOptions = {
    buttonHidden: true,
  };

  private _isInitialized = false;
  private _currentViewkeeperClasses: string[];
  private activeViewId: string;
  private allViewkeeperClasses: { [viewId: string]: string[] } = {};
  private ngUnsubscribe = new Subject();
  private sourceId = 'dataManagerComponent';

  constructor(
    private changeDetection: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {}

  public ngOnInit(): void {
    this.dataManagerService
      .getDataStateUpdates(this.sourceId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => (this.isInitialized = true));

    this.dataManagerService.viewkeeperClasses
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((classes) => {
        this.allViewkeeperClasses = classes;
        this.currentViewkeeperClasses = classes[this.activeViewId];
      });

    this.dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.activeViewId = activeViewId;
        this.backToTopController.next({
          type: SkyBackToTopMessageType.BackToTop,
        });
        this.currentViewkeeperClasses =
          this.allViewkeeperClasses[this.activeViewId];
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
