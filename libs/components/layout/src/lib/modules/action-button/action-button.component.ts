import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { SkyHrefChange } from '@skyux/router';

import { SkyActionButtonPermalink } from './action-button-permalink';

/**
 * Creates a button to present users with an option to move forward with tasks.
 */
@Component({
  selector: 'sky-action-button',
  styleUrls: [
    './action-button.default.component.scss',
    './action-button.modern.component.scss',
  ],
  templateUrl: './action-button.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyActionButtonComponent {
  @HostBinding('hidden')
  public hidden = false;

  /**
   * The link for the action button.
   */
  @Input()
  public permalink: SkyActionButtonPermalink | undefined;

  /**
   * Fires when users select the action button.
   */
  @Output()
  public actionClick = new EventEmitter<any>();

  #changeDetector: ChangeDetectorRef;

  constructor(@SkipSelf() changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public buttonClicked(): void {
    this.actionClick.emit();
  }

  public enterPress(): void {
    this.actionClick.emit();
  }

  public onSkyHrefDisplayChange($event: SkyHrefChange): void {
    if (this.hidden === $event.userHasAccess) {
      setTimeout(() => {
        this.hidden = !$event.userHasAccess;
        this.#changeDetector.markForCheck();
      });
    }
  }
}
