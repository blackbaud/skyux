import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDataManagerService
} from './data-manager.service';

/**
 * The top-level data manager component. Provide `SkyDataManagerService` at this level.
 */
@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerComponent {

  public get isInitialized(): boolean {
    return this.dataManagerService.isInitialized;
  }

  constructor(
    private dataManagerService: SkyDataManagerService
  ) { }
}
