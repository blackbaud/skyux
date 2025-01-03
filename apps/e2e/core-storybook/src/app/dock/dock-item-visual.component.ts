import { Component, Optional } from '@angular/core';

import { Subject } from 'rxjs';

import { DockItemVisualContext } from './dock-item-context';

let uniqueId = 0;

@Component({
  selector: 'app-dock-item-visual',
  styleUrls: ['./dock-item-visual.component.scss'],
  templateUrl: './dock-item-visual.component.html',
  standalone: false,
})
export class DockItemVisualComponent {
  public closeClicked = new Subject<void>();

  public height = 'auto';

  public stackOrderForDisplay: number;

  public uniqueId: number;

  constructor(@Optional() public context: DockItemVisualContext) {
    this.uniqueId = ++uniqueId;
    this.stackOrderForDisplay = context?.stackOrder ?? 0;
  }

  public setHeight(): void {
    this.height = '150px';
  }

  public onCloseClick(): void {
    this.closeClicked.next();
    this.closeClicked.complete();
  }
}
