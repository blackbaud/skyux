import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class SkyRowComponent {
  /**
   * Indicates whether to reverse the display order for columns in the row.
   * @default false
   */
  @Input()
  public reverseColumnOrder: boolean = false;
}
