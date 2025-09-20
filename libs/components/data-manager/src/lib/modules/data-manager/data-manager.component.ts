import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyLiveAnnouncerService, SkyViewkeeperModule } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import {
  SkyBackToTopMessage,
  SkyBackToTopMessageType,
  SkyBackToTopModule,
} from '@skyux/layout';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from './data-manager.service';
import { SkyDataManagerState } from './models/data-manager-state';
import { SkyDataManagerSummary } from './models/data-manager-summary';

const VIEWKEEPER_CLASSES_DEFAULT = ['.sky-data-manager-toolbar'];

/**
 * The top-level data manager component. Provide `SkyDataManagerService` at this level.
 */
@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyBackToTopModule, SkyViewkeeperModule],
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
  #dataState: SkyDataManagerState | undefined;

  #_isInitialized = false;
  #_currentViewkeeperClasses = VIEWKEEPER_CLASSES_DEFAULT;

  readonly #changeDetection = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #resourceSvc = inject(SkyLibResourcesService);

  public ngOnInit(): void {
    this.#dataManagerService
      .getDataStateUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((state) => {
        this.isInitialized = true;
        this.#dataState = state;
      });

    this.#dataManagerService
      .getDataSummaryUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((summary: SkyDataManagerSummary) => {
        const itemsSelected = this.#dataState?.selectedIds?.length || 0;
        const resourceString = `skyux_data_manager_status_update_${
          this.#dataState?.onlyShowSelected
            ? 'only_selected'
            : itemsSelected
              ? 'with_selections'
              : 'without_selections'
        }`;

        this.#announceState(
          resourceString,
          summary.itemsMatching,
          summary.totalItems,
          itemsSelected,
        );
      });

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

  #announceState(
    resourceString: string,
    itemsMatching: number,
    totalItems: number,
    itemsSelected: number,
  ): void {
    this.#resourceSvc
      .getString(resourceString, itemsMatching, totalItems, itemsSelected)
      .pipe(take(1))
      .subscribe((internationalizedString) => {
        this.#liveAnnouncer.announce(internationalizedString);
      });
  }
}
