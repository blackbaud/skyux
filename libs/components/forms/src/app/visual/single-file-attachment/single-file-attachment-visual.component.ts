import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyFileItem,
  SkyFileLink
} from '../../public/public_api';

@Component({
  selector: 'single-file-attachment-visual',
  templateUrl: './single-file-attachment-visual.component.html'
})
export class SingleFileAttachmentVisualComponent implements OnInit {

  public acceptedTypes: Array<String>;

  public attachment: FormControl;

  public disabled: boolean = false;

  public fileForm: FormGroup;

  public filesToUpload: Array<SkyFileItem>;

  public fileValue: SkyFileItem;

  public maxFileSize: number = 4000000;

  public rejectedFiles: Array<SkyFileItem>;

  public required: boolean = true;

  public showLabel: boolean = true;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.filesToUpload = [];
    this.rejectedFiles = [];
  }

  public ngOnInit(): void {
    this.attachment = new FormControl(undefined);
    this.fileForm = this.formBuilder.group({
      attachment: this.attachment
    });
  }

  public validateFile(file: SkyFileItem): string {
    if (file.file.name.indexOf('a') === 0) {
        return 'You may not upload a file that begins with the letter "a."';
    } else {
      return '';
    }
  }

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    this.removeFromArray(this.filesToUpload, file);
  }

  /**
   * Toggle both the template-driven and reactive form.
   */
  public onToggleDisabledClick(): void {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.attachment.disable();
    } else {
      this.attachment.enable();
    }
  }

  private removeFromArray(items: Array<any>, obj: SkyFileItem | SkyFileLink): void {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
}
