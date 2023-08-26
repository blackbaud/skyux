import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import {
  SkyBackToTopMessage,
  SkyBackToTopMessageType,
  SkyBackToTopModule,
} from '@skyux/layout';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from './data-manager.service';

const VIEWKEEPER_CLASSES_DEFAULT = ['.sky-data-manager-toolbar'];

/**
 * The top-level data manager component. Provide `SkyDataManagerService` at this level.
 */
@Component({
  standalone: true,
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyBackToTopModule, SkyViewkeeperModule],
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

  #_isInitialized = false;
  #_currentViewkeeperClasses = VIEWKEEPER_CLASSES_DEFAULT;

  readonly #changeDetection = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService);

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
