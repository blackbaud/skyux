import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  SkyFileAttachmentsModule,
  SkyFileDropChange,
  SkyFileItem,
  SkyFileLink,
} from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, SkyFileAttachmentsModule, SkyStatusIndicatorModule],
})
export class DemoComponent {
  protected acceptedTypes = 'image/png,image/jpeg';
  protected allItems: (SkyFileItem | SkyFileLink)[] = [];
  protected hintText = '5 MB maximum';
  protected inlineHelpContent =
    'Your logo appears in places such as authentication pages, student and parent portals, and extracurricular home pages.';
  protected labelText = 'Logo image';
  protected maxFileSize = 5242880;
  protected rejectedFiles: SkyFileItem[] = [];
  protected required = true;
  protected stacked = 'true';

  #filesToUpload: SkyFileItem[] = [];
  #linksToUpload: SkyFileLink[] = [];

  protected deleteFile(file: SkyFileItem | SkyFileLink): void {
    this.#removeFromArray(this.allItems, file);
    this.#removeFromArray(this.#filesToUpload, file);
    this.#removeFromArray(this.#linksToUpload, file);
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
    return file.file.name.startsWith('a')
      ? 'Upload a file that does not begin with the letter "a"'
      : undefined;
  }

  #removeFromArray(
    items: (SkyFileItem | SkyFileLink)[],
    obj: SkyFileItem | SkyFileLink,
  ): void {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
}
