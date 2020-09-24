import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  SkyActionButtonPermalink
} from './action-button-permalink';

/**
 * Creates a button to present users with an option to move forward with tasks.
 */
@Component({
  selector: 'sky-action-button',
  styleUrls: ['./action-button.component.scss'],
  templateUrl: './action-button.component.html'
})
export class SkyActionButtonComponent {
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

  public buttonClicked() {
    this.actionClick.emit();
  }

  public enterPress() {
    this.actionClick.emit();
  }
}
