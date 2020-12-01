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
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyFileItem,
  SkyFileLink
} from '../../public/public_api';

@Component({
  selector: 'single-file-attachment-visual',
  templateUrl: './single-file-attachment-visual.component.html',
  styleUrls: [
    './single-file-attachment-visual.component.scss'
  ]
})
export class SingleFileAttachmentVisualComponent implements OnInit {

  public acceptedTypes: Array<String>;

  public attachment: FormControl = new FormControl(undefined);

  public attachmentFileUploaded: FormControl = new FormControl(undefined);

  public attachmentImageUploaded: FormControl = new FormControl(undefined);

  public disabled: boolean = false;

  public singleFileAttachmentForm: FormGroup;

  public filesToUpload: Array<SkyFileItem>;

  public fileValue: SkyFileItem;

  public maxFileSize: number = 4000000;

  public rejectedFiles: Array<SkyFileItem>;

  public required: boolean = true;

  public showLabel: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) {
    this.filesToUpload = [];
    this.rejectedFiles = [];
  }

  public ngOnInit(): void {
    this.singleFileAttachmentForm = this.formBuilder.group({
      attachment: this.attachment,
      attachmentFileUploaded: this.attachmentFileUploaded,
      attachmentImageUploaded: this.attachmentImageUploaded
    });
    this.initTestingData();
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
      this.attachmentFileUploaded.disable();
      this.attachmentImageUploaded.disable();
    } else {
      this.attachment.enable();
      this.attachmentFileUploaded.disable();
      this.attachmentImageUploaded.disable();
    }
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

  private initTestingData(): void {
    const testImage = <SkyFileItem> {
      file: {
        name: 'myFile.jpeg',
        type: 'image/jpeg',
        size: 1000
      },
      url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCkAniUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z'
    };
    this.attachmentImageUploaded.setValue(testImage);

    const testFile = <SkyFileItem> {
      file: {
        name: 'myFile.txt',
        type:  'txt/txt',
        size: 10
      },
      url: 'myFile.txt'
    };
    this.attachmentFileUploaded.setValue(testFile);
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
