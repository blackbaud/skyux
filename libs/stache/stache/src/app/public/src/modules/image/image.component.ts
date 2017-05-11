import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class StacheImageComponent {
  @Input()
  public imageSource: string;
}
