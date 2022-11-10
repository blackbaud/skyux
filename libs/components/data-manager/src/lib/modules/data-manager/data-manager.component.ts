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

const VIEWKEEPER_CLASSES_DEFAULT = ['.sky-data-manager-toolbar'];

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
    return this.#_currentViewkeeperClasses;
  }

  public set currentViewkeeperClasses(value: string[] | undefined) {
    this.#_currentViewkeeperClasses = [
      ...VIEWKEEPER_CLASSES_DEFAULT,
      ...(value || []),
    ];
    this.#changeDetection.markForCheck();
  }

  public get isInitialized(): boolean {
    return this.#_isInitialized;
  }

  public set isInitialized(value: boolean) {
    this.#_isInitialized = value;
    this.#changeDetection.markForCheck();
  }

  public backToTopController = new Subject<SkyBackToTopMessage>();

  public backToTopOptions = {
    buttonHidden: true,
  };

  #activeViewId: string | undefined;
  #allViewkeeperClasses: Record<string, string[]> = {};
  #ngUnsubscribe = new Subject<void>();
  #sourceId = 'dataManagerComponent';
  #changeDetection: ChangeDetectorRef;
  #dataManagerService: SkyDataManagerService;

  #_isInitialized = false;
  #_currentViewkeeperClasses = VIEWKEEPER_CLASSES_DEFAULT;

  constructor(
    changeDetection: ChangeDetectorRef,
    dataManagerService: SkyDataManagerService
  ) {
    this.#changeDetection = changeDetection;
    this.#dataManagerService = dataManagerService;
  }

  public ngOnInit(): void {
    this.#dataManagerService
      .getDataStateUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => (this.isInitialized = true));

    this.#dataManagerService.viewkeeperClasses
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((classes) => {
        this.#allViewkeeperClasses = classes;
        this.currentViewkeeperClasses = this.#activeViewId
          ? classes[this.#activeViewId]
          : undefined;
      });

    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.#activeViewId = activeViewId;
        this.backToTopController.next({
          type: SkyBackToTopMessageType.BackToTop,
        });
        this.currentViewkeeperClasses =
          this.#allViewkeeperClasses[this.#activeViewId];
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
