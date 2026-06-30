import { Component, ViewChild, input } from '@angular/core';

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
  public text = input<string | undefined>(undefined);
  public maxExpandedNewlines = input<number | undefined>(undefined);
  public maxExpandedLength = input<number | undefined>(undefined);
  public maxLength = input<number | undefined>(undefined);
  public truncateNewlines = input<boolean>(true);
}
