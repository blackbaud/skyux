import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class SkyRowComponent {
  @Input()
  public reverseColumnOrder: boolean = false;
}
