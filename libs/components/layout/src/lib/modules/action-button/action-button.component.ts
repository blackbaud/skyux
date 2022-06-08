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

import { SkyActionButtonPermalink } from './action-button-permalink';

/**
 * Creates a button to present users with an option to move forward with tasks.
 */
@Component({
  selector: 'sky-action-button',
  styleUrls: ['./action-button.component.scss'],
  templateUrl: './action-button.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SkyActionButtonComponent {
  @HostBinding('hidden')
  public hidden = false;

  /**
   * Specifies a link for the action button.
   */
  @Input()
  public permalink: SkyActionButtonPermalink;

  /**
   * Fires when users select the action button.
   */
  @Output()
  public actionClick = new EventEmitter<any>();

  constructor(@SkipSelf() private changeRef: ChangeDetectorRef) {}

  public buttonClicked() {
    this.actionClick.emit();
  }

  public enterPress() {
    this.actionClick.emit();
  }

  public onSkyHrefDisplayChange($event: boolean) {
    if (this.hidden === $event) {
      setTimeout(() => {
        this.hidden = !$event;
        this.changeRef.markForCheck();
      });
    }
  }
}
