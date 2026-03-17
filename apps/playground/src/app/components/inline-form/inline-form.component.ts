import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
} from '@skyux/inline-form';

@Component({
  selector: 'app-inline-form',
  templateUrl: './inline-form.component.html',
  standalone: false,
})
export class InlineFormComponent {
  @ViewChild('formTemplate')
  public formTemplate: TemplateRef<unknown> | undefined;

  public showForm = false;

  public lastCloseReason: string | undefined;

  protected readonly buttonLayout = SkyInlineFormButtonLayout.SaveCancel;

  public onClose(args: SkyInlineFormCloseArgs): void {
    this.lastCloseReason = args.reason;
    this.showForm = false;
  }

  public openForm(): void {
    this.lastCloseReason = undefined;
    this.showForm = true;
  }
}
