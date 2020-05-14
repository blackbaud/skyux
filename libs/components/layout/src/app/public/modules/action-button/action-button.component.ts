import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  SkyActionButtonPermalink
} from './action-button-permalink';

@Component({
  selector: 'sky-action-button',
  styleUrls: ['./action-button.component.scss'],
  templateUrl: './action-button.component.html'
})
export class SkyActionButtonComponent {
  @Input()
  public permalink: SkyActionButtonPermalink;

  @Output()
  public actionClick = new EventEmitter<any>();

  public buttonClicked() {
    this.actionClick.emit();
  }

  public enterPress() {
    this.actionClick.emit();
  }
}
