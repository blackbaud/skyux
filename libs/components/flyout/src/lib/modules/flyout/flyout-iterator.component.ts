import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { Subject } from 'rxjs';

import { SkyFlyoutResourcesModule } from '../shared/sky-flyout-resources.module';

/**
 * @internal
 */
@Component({
  selector: 'sky-flyout-iterator',
  templateUrl: './flyout-iterator.component.html',
  styleUrls: ['./flyout-iterator.component.scss'],
  imports: [SkyIconModule, SkyFlyoutResourcesModule, SkyThemeModule],
})
export class SkyFlyoutIteratorComponent implements OnDestroy {
  @Input()
  public nextButtonDisabled: boolean | undefined;

  @Input()
  public previousButtonDisabled: boolean | undefined;

  @Output()
  public get previousButtonClick(): EventEmitter<void> {
    return this.#_previousButtonClick;
  }

  @Output()
  public get nextButtonClick(): EventEmitter<void> {
    return this.#_nextButtonClick;
  }

  #ngUnsubscribe = new Subject<void>();

  #_nextButtonClick = new EventEmitter<void>();

  #_previousButtonClick = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onIteratorPreviousClick(): void {
    /* istanbul ignore else */
    if (!this.previousButtonDisabled) {
      this.#_previousButtonClick.emit();
    }
  }

  public onIteratorNextClick(): void {
    /* istanbul ignore else */
    if (!this.nextButtonDisabled) {
      this.#_nextButtonClick.emit();
    }
  }
}
