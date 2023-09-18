import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import {
  SkyFileAttachmentsModule,
  SkyFileDropChange,
  SkyFileItem,
  SkyFileLink,
  SkyInputBoxModule,
} from '@skyux/forms';
import {
  SkyHelpInlineModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class DemoComponent {
  protected acceptedTypes = 'image/png,image/jpeg';
  protected allItems: (SkyFileItem | SkyFileLink)[] = [];
  protected maxFileSize = 4000000;
  protected rejectedFiles: SkyFileItem[] = [];

  #filesToUpload: SkyFileItem[] = [];
  #linksToUpload: SkyFileLink[] = [];

  protected deleteFile(file: SkyFileItem | SkyFileLink): void {
    this.#removeFromArray(this.allItems, file);
    this.#removeFromArray(this.#filesToUpload, file);
    this.#removeFromArray(this.#linksToUpload, file);
  }

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }

  protected onFilesChanged(change: SkyFileDropChange): void {
    this.#filesToUpload = this.#filesToUpload.concat(change.files);
    this.rejectedFiles = change.rejectedFiles;
    this.allItems = this.allItems.concat(change.files);
  }

  protected onLinkChanged(change: SkyFileLink): void {
    this.#linksToUpload = this.#linksToUpload.concat(change);
    this.allItems = this.allItems.concat(change);
  }

  protected validateFile(file: SkyFileItem): string | undefined {
    return file.file.name.indexOf('a') === 0
      ? 'You may not upload a file that begins with the letter "a."'
      : undefined;
  }

  #removeFromArray(
    items: (SkyFileItem | SkyFileLink)[],
    obj: SkyFileItem | SkyFileLink
  ): void {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
}
