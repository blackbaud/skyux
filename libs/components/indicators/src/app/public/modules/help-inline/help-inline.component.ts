import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-help-inline',
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss']
})
export class SkyHelpInlineComponent {

  /**
   * Fires when the user clicks the help inline button.
   */
  @Output()
  public actionClick = new EventEmitter<any>();

  public onClick(): void {
    this.actionClick.emit();
  }
}
