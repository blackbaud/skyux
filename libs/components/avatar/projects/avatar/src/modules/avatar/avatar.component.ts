import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { ErrorModalConfig, SkyErrorModalService } from '@skyux/errors';

import { SkyFileDropChange, SkyFileItem, SkyFileSizePipe } from '@skyux/forms';

import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyAvatarSize } from './avatar-size';

import { SkyAvatarSrc } from './avatar-src';

@Component({
  selector: 'sky-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyAvatarComponent {
  /**
   * Indicates whether users can change the image. To select a different image,
   * users click the image or drag another image on top of it,
   * much like the `sky-file-drop` component in the
   * [file attachment module](https://developer.blackbaud.com/skyux/components/file-attachments/file-attachment).
   * @default false
   */
  @Input()
  public set canChange(value: boolean) {
    this._canChange = value;
  }

  public get canChange(): boolean {
    return this._canChange;
  }

  /**
   * Specifies the name of the record that the avatar represents.
   * If the `src` property does not specify an image, the component displays
   * initials from the first and last words in the name. To ensure
   * that the component extracts the correct initials, specify a name with no prefix
   * or suffix, or just specify initials with a space between them. This property is
   * not required, but the component requires either the `name` or `src` property.
   */
  @Input()
  public set name(value: string) {
    this._name = value;
  }

  public get name(): string {
    return this._name;
  }

  /**
   * Specifies an image to display to identify a record. This property is
   * not required, but the component requires either the `name` or `src` property.
   */
  @Input()
  public set src(value: SkyAvatarSrc) {
    this._src = value;
  }

  public get src(): SkyAvatarSrc {
    return this._src;
  }

  /**
   * Specifies the maximum file size for the image in bytes.
   */
  @Input()
  public maxFileSize = 500000;

  /**
   * Specifies the size of the avatar.
   */
  @Input()
  public size: SkyAvatarSize = 'large';

  /**
   * Emits a `SkyFileItem` object when the image is updated.
   */
  @Output()
  public avatarChanged = new EventEmitter<SkyFileItem>();

  private _canChange: boolean;

  private _name: string;

  private _src: SkyAvatarSrc;

  constructor(
    private errorService: SkyErrorModalService,
    private fileSizePipe: SkyFileSizePipe,
    private resourcesService: SkyLibResourcesService
  ) {}

  public photoDrop(result: SkyFileDropChange): void {
    /* sanity check */
    /* istanbul ignore else */
    if (result.files && result.files.length > 0) {
      this.avatarChanged.emit(result.files[0]);
    } else if (result.rejectedFiles && result.rejectedFiles.length > 0) {
      this.handleError(result.rejectedFiles);
    }
  }

  private handleError(rejectedFiles: Array<SkyFileItem>): void {
    const rejectedFile = rejectedFiles[0];

    if (rejectedFile.errorType === 'maxFileSize') {
      const title = this.getString('skyux_avatar_error_too_large_title');
      const description = this.getString(
        'skyux_avatar_error_too_large_description',
        this.maxFileSizeText()
      );

      this.openErrorModal(title, description);
    } else if (rejectedFile.errorType === 'fileType') {
      const title = this.getString('skyux_avatar_error_not_image_title');
      const description = this.getString(
        'skyux_avatar_error_not_image_description'
      );

      this.openErrorModal(title, description);
    }
  }

  private maxFileSizeText(): string {
    return this.fileSizePipe.transform(this.maxFileSize);
  }

  private openErrorModal(title: string, description: string): void {
    const config: ErrorModalConfig = {
      errorTitle: title,
      errorDescription: description,
      errorCloseText: this.getString('skyux_avatar_errormodal_ok'),
    };

    this.errorService.open(config);
  }

  private getString(key: string, ...args: any[]): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key,
      ...args
    );
  }
}
