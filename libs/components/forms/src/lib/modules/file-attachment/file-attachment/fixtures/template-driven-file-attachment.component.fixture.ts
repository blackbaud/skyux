import { Component, ViewChild } from '@angular/core';

import { SkyFileAttachmentComponent } from '../file-attachment.component';
import { SkyFileAttachmentModule } from '../file-attachment.module';

@Component({
  imports: [SkyFileAttachmentModule],
  selector: 'sky-file-attachment-test',
  template: `
    <sky-file-attachment [disabled]="disabled">
      <sky-file-attachment-label> Field Label </sky-file-attachment-label>
    </sky-file-attachment>
  `,
})
export class TemplateDrivenFileAttachmentTestComponent {
  public disabled = false;

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent!: SkyFileAttachmentComponent;
}
