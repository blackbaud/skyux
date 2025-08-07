import { Component, ViewChild } from '@angular/core';

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
  public parentTabIndex: number | undefined;

  public pending: boolean | undefined = false;

  public showDelete = true;

  public showExtraButtons = false;

  public showCoveredButtons = true;

  @ViewChild(SkyInlineDeleteComponent, {
    read: SkyInlineDeleteComponent,
    static: false,
  })
  public inlineDelete!: SkyInlineDeleteComponent;

  public onCancelTriggered(): void {
    this.showDelete = false;
  }

  public onDeleteTriggered(): void {
    this.showDelete = false;
  }
}
