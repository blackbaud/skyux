import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from './data-manager.service';

/**
 * A data view is rendered within a data manager component.
 * It can subscribe to data state changes from `SkyDataManagerService` and apply the filters,
 * search text, and more to the data it displays.
 */
@Component({
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataViewComponent implements OnDestroy, OnInit {
  /**
   * The configuration for the view. See the `SkyDataViewConfig` interface.
   * @required
   */

  @Input()
  public viewId: string | undefined;

  @Input()
  public isActive: boolean | undefined;

  #ngUnsubscribe = new Subject<void>();
  #dataManagerService: SkyDataManagerService;

  constructor(dataManagerService: SkyDataManagerService) {
    this.#dataManagerService = dataManagerService;
  }

  public ngOnInit(): void {
    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.isActive = this.viewId === activeViewId;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
