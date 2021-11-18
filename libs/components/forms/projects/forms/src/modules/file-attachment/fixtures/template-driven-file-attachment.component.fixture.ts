import { Component, ViewChild } from '@angular/core';

import { SkyFileAttachmentComponent } from '../file-attachment.component';

@Component({
  selector: 'sky-file-attachment-test',
  template: `
    <sky-file-attachment [disabled]="disabled">
      <sky-file-attachment-label> Field Label </sky-file-attachment-label>
    </sky-file-attachment>
  `,
})
export class TemplateDrivenFileAttachmentTestComponent {
  public disabled: boolean = false;

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent: SkyFileAttachmentComponent;
}
