import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyDefaultInputProvider } from '@skyux/core';
import { ErrorModalConfig, SkyErrorModalService } from '@skyux/errors';
import {
  SkyFileDropChange,
  SkyFileDropModule,
  SkyFileItem,
  SkyFileSizePipe,
} from '@skyux/forms';
import { SkyI18nModule, SkyLibResourcesService } from '@skyux/i18n';

import { Observable } from 'rxjs';

import { SkyAvatarResourcesModule } from '../shared/sky-avatar-resources.module';

import { SkyAvatarSize } from './avatar-size';
import { SkyAvatarSrc } from './avatar-src';
import { SkyAvatarInnerComponent } from './avatar.inner.component';

const MAX_FILE_SIZE_DEFAULT = 512000;

@Component({
  selector: 'sky-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SkyFileSizePipe],
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    SkyI18nModule,
    SkyFileDropModule,
    SkyAvatarResourcesModule,
    SkyAvatarInnerComponent,
  ],
})
export class SkyAvatarComponent {
  /**
   * Whether users can change the image. To select a different image,
   * users click the image or drag another image on top of it,
   * much like the `sky-file-drop` component in the
   * [file attachment module](https://developer.blackbaud.com/skyux/components/file-attachments/file-attachment).
   * @default false
   */
  @Input()
  public set canChange(value: boolean | undefined) {
    this.#_canChange = !!value;
  }

  public get canChange(): boolean {
    return this.#_canChange;
  }

  /**
   * The name of the record that the avatar represents.
   * If the `src` property does not specify an image, the component displays
   * initials from the first and last words in the name. To ensure
   * that the component extracts the correct initials, specify a name with no prefix
   * or suffix, or just specify initials with a space between them. This property is
   * not required, but the component requires either the `name` or `src` property.
   */
  @Input()
  public set name(value: string | undefined) {
    this.#_name = value;
  }

  public get name(): string | undefined {
    return this.#_name;
  }

  /**
   * The image to identify a record. This property is
   * not required, but the component requires either the `name` or `src` property.
   */
  @Input()
  public set src(value: SkyAvatarSrc | undefined) {
    this.#_src = value;
  }

  public get src(): SkyAvatarSrc | undefined {
    return this.#_src;
  }

  /**
   * The maximum file size for the image in bytes.
   * @default 512000 bytes
   */
  @Input()
  public maxFileSize: number | undefined = MAX_FILE_SIZE_DEFAULT;

  /**
   * The size of the avatar.
   * Acceptable values are: `"small"`, `"medium"`, and `"large"`.
   * @default "large"
   */
  @Input()
  public size: SkyAvatarSize | undefined;

  /**
   * Emits a `SkyFileItem` object when the image is updated.
   */
  @Output()
  public avatarChanged = new EventEmitter<SkyFileItem>();

  protected sizeDefault: Observable<SkyAvatarSize> | undefined;

  #_canChange = false;

  #_name: string | undefined;

  #_src: SkyAvatarSrc | undefined;

  #errorService: SkyErrorModalService;
  #fileSizePipe: SkyFileSizePipe;
  #resourcesService: SkyLibResourcesService;

  #defaultInputProvider = inject(SkyDefaultInputProvider, { optional: true });

  constructor(
    errorService: SkyErrorModalService,
    fileSizePipe: SkyFileSizePipe,
    resourcesService: SkyLibResourcesService,
  ) {
    this.#errorService = errorService;
    this.#fileSizePipe = fileSizePipe;
    this.#resourcesService = resourcesService;

    this.sizeDefault = this.#defaultInputProvider?.getValue<SkyAvatarSize>(
      'avatar',
      'size',
    );
  }

  public photoDrop(result: SkyFileDropChange): void {
    /* sanity check */
    /* istanbul ignore else */
    if (result.files && result.files.length > 0) {
      this.avatarChanged.emit(result.files[0]);
    } else if (result.rejectedFiles && result.rejectedFiles.length > 0) {
      this.#handleError(result.rejectedFiles);
    }
  }

  #handleError(rejectedFiles: SkyFileItem[]): void {
    const rejectedFile = rejectedFiles[0];

    if (rejectedFile.errorType === 'maxFileSize') {
      const title = this.#getString('skyux_avatar_error_too_large_title');
      const description = this.#getString(
        'skyux_avatar_error_too_large_description',
        this.#maxFileSizeText(),
      );

      this.#openErrorModal(title, description);
    } else if (rejectedFile.errorType === 'fileType') {
      const title = this.#getString('skyux_avatar_error_not_image_title');
      const description = this.#getString(
        'skyux_avatar_error_not_image_description',
      );

      this.#openErrorModal(title, description);
    }
  }

  #maxFileSizeText(): string {
    return this.#fileSizePipe.transform(this.maxFileSize);
  }

  #openErrorModal(title: string, description: string): void {
    const config: ErrorModalConfig = {
      errorTitle: title,
      errorDescription: description,
      errorCloseText: this.#getString('skyux_avatar_errormodal_ok'),
    };

    this.#errorService.open(config);
  }

  #getString(key: string, ...args: any[]): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.#resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key,
      ...args,
    );
  }
}
