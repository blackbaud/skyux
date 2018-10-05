import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss']
})
export class SkyKeyInfoComponent {
  @Input()
  public layout = 'vertical';
}
