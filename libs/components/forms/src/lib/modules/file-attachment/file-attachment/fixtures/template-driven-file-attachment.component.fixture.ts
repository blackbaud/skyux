import { Component, ViewChild, input } from '@angular/core';

import { SkyFileAttachmentComponent } from '../file-attachment.component';
import { SkyFileAttachmentModule } from '../file-attachment.module';

@Component({
  imports: [SkyFileAttachmentModule],
  selector: 'sky-file-attachment-test',
  template: `
    <sky-file-attachment labelText="Field Label" [disabled]="disabled()" />
  `,
})
export class TemplateDrivenFileAttachmentTestComponent {
  public disabled = input(false);

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent!: SkyFileAttachmentComponent;
}
