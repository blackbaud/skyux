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
  @Output()
  public actionClick = new EventEmitter<any>();

  public onClick() {
    this.actionClick.emit();
  }
}
