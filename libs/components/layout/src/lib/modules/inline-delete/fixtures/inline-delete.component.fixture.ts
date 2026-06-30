import { Component, ViewChild, input, model } from '@angular/core';

import { SkyInlineDeleteComponent } from '../inline-delete.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './inline-delete.component.fixture.html',
  styles: [
    `
      #inline-delete-fixture {
        height: 400px;
        position: relative;
        width: 400px;
      }

      #hidden-button {
        visibility: hidden;
      }
    `,
  ],
  standalone: false,
})
export class InlineDeleteTestComponent {
  public parentTabIndex = input<number | undefined>(undefined);

  public pending = input<boolean | undefined>(false);

  public showDelete = model<boolean>(true);

  public showExtraButtons = input<boolean>(false);

  public showCoveredButtons = input<boolean>(true);

  @ViewChild(SkyInlineDeleteComponent, {
    read: SkyInlineDeleteComponent,
    static: false,
  })
  public inlineDelete!: SkyInlineDeleteComponent;

  public onCancelTriggered(): void {
    this.showDelete.set(false);
  }

  public onDeleteTriggered(): void {
    this.showDelete.set(false);
  }
}
