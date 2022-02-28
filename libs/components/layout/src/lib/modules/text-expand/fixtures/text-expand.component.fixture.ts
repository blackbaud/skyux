import { Component, ViewChild } from '@angular/core';
import { SkyTextExpandComponent } from '../text-expand.component';

@Component({
  selector: 'sky-text-expand-demo',
  templateUrl: './text-expand.component.fixture.html',
})
export class TextExpandTestComponent {
  @ViewChild(SkyTextExpandComponent, {
    read: SkyTextExpandComponent,
    static: false,
  })
  public textExpand: SkyTextExpandComponent;
  public text: string;
  public maxLength: number;
  public truncateNewlines = true;
}
