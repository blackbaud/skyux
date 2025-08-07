import { Component, ViewChild } from '@angular/core';

import { SkyTextExpandComponent } from '../text-expand.component';

@Component({
  selector: 'sky-text-expand-demo',
  templateUrl: './text-expand.component.fixture.html',
  standalone: false,
})
export class TextExpandTestComponent {
  @ViewChild(SkyTextExpandComponent, {
    read: SkyTextExpandComponent,
    static: false,
  })
  public textExpand: SkyTextExpandComponent | undefined;
  public text: string | undefined;
  public maxExpandedNewlines: number | undefined;
  public maxExpandedLength: number | undefined;
  public maxLength: number | undefined;
  public truncateNewlines = true;
}
