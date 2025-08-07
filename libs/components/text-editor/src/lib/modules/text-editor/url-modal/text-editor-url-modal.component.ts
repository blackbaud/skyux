import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyTabIndex, SkyTabsModule } from '@skyux/tabs';
import { SkyValidation } from '@skyux/validation';

import { SkyTextEditorResourcesModule } from '../../shared/sky-text-editor-resources.module';

import { SkyUrlModalContext } from './text-editor-url-modal-context';
import { UrlModalResult } from './text-editor-url-modal-result';
import { UrlTarget } from './text-editor-url-target';

const emailKey = 'mailto:';
const queryStringParamKey = '?Subject=';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-url-modal',
  templateUrl: './text-editor-url-modal.component.html',
  styleUrls: ['./text-editor-url-modal.component.scss'],
  imports: [
    FormsModule,
    SkyModalModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTabsModule,
    SkyTextEditorResourcesModule,
  ],
})
export class SkyTextEditorUrlModalComponent {
  public set activeTab(value: number) {
    this.#_activeTab = value;
    this.valid = this.#isValid();
  }

  public get activeTab(): number {
    return this.#_activeTab;
  }

  public set emailAddress(value: string) {
    this.#_emailAddress = value;
    this.valid = this.#isValid();
  }

  public get emailAddress(): string {
    return this.#_emailAddress;
  }

  public set url(value: string) {
    this.#_url = value;
    this.valid = this.#isValid();
  }

  public get url(): string {
    return this.#_url;
  }

  public emailAddressValid = false;
  public allowAllOpenLinkOptions = true;
  public openLinksInNewWindowOnly = false;
  public subject = '';
  public target: number | string = 0;
  public valid = false;

  #_activeTab = 0;
  #_emailAddress = '';
  #_url = 'https://';

  readonly #modalContext = inject(SkyUrlModalContext);
  readonly #modalInstance = inject(SkyModalInstance);

  constructor() {
    const linkWindowOptions = this.#modalContext.linkWindowOptions;

    if (linkWindowOptions?.length === 1) {
      this.allowAllOpenLinkOptions = false;
      if (linkWindowOptions[0] === 'new') {
        this.openLinksInNewWindowOnly = true;
        this.target = 1;
      } else {
        this.target = 0;
      }
    }

    if (this.#modalContext.urlResult) {
      if (this.#modalContext.urlResult.url.startsWith(emailKey)) {
        this.emailAddress = this.#modalContext.urlResult.url.replace(
          emailKey,
          '',
        );

        let queryStringIndex = this.emailAddress.indexOf(queryStringParamKey);
        queryStringIndex =
          queryStringIndex > -1
            ? queryStringIndex
            : this.emailAddress.indexOf(queryStringParamKey.toLowerCase());

        /* istanbul ignore else */
        if (queryStringIndex > -1) {
          this.subject = decodeURI(this.emailAddress).slice(
            queryStringIndex + queryStringParamKey.length,
          );
          this.emailAddress = this.emailAddress.slice(0, queryStringIndex);
        }

        // Set active tab to email
        this.activeTab = 1;
      } else {
        this.url = this.#modalContext.urlResult.url;
        this.target = this.#modalContext.urlResult.target as any;

        // set active tab to web page
        this.activeTab = 0;
      }
    }
  }

  public activeTabChanged(value: SkyTabIndex): void {
    this.activeTab = Number(value);
  }

  public save(): void {
    /* istanbul ignore else */
    if (this.#isValid()) {
      if (this.activeTab === 0) {
        this.#modalInstance.save({
          url: this.url,
          target: this.target
            ? parseInt(this.target as string, undefined)
            : UrlTarget.None,
        } as UrlModalResult);
      } else {
        this.#modalInstance.save({
          url: this.#getEmailUrl(),
          target: UrlTarget.None,
        } as UrlModalResult);
      }
    }
  }

  public cancel(): void {
    this.#modalInstance.cancel();
  }

  #getEmailUrl(): string {
    return (
      emailKey +
      this.emailAddress +
      (this.subject ? '?Subject=' + encodeURI(this.subject) : '')
    );
  }

  #isValid(): boolean {
    if (this.activeTab === 0) {
      return !!this.url && SkyValidation.isUrl(this.url);
    }
    return !!this.emailAddress && SkyValidation.isEmail(this.emailAddress);
  }
}
