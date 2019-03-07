import { Component } from '@angular/core';

@Component({
  selector: 'repeater-visual',
  templateUrl: './repeater-visual.component.html',
  styleUrls: ['./repeater-visual.component.scss']
})
export class RepeaterVisualComponent {
  public onCollapse(): void {
    console.log('Collapsed.');
  }

  public onExpand(): void {
    console.log('Expanded.');
  }
}
