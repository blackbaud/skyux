import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';
import { SkyValidation } from '@skyux/validation';

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
})
export class SkyTextEditorUrlModalComponent {
  public set activeTab(value: number) {
    this._activeTab = value;
    this.valid = this.isValid();
  }
  public get activeTab(): number {
    return this._activeTab;
  }
  public set emailAddress(value: string) {
    this._emailAddress = value;
    this.valid = this.isValid();
  }
  public get emailAddress(): string {
    return this._emailAddress;
  }

  public set url(value: string) {
    this._url = value;
    this.valid = this.isValid();
  }
  public get url(): string {
    return this._url;
  }

  public emailAddressValid = false;

  public subject = '';

  public target = 0;

  public valid = false;

  public _activeTab = 0;

  private _emailAddress = '';

  private _url = 'https://';

  constructor(
    private readonly modalInstance: SkyModalInstance,
    modalContext: SkyUrlModalContext
  ) {
    if (modalContext.urlResult) {
      if (modalContext.urlResult.url.startsWith(emailKey)) {
        this.emailAddress = modalContext.urlResult.url.replace(emailKey, '');

        let queryStringIndex = this.emailAddress.indexOf(queryStringParamKey);
        queryStringIndex =
          queryStringIndex > -1
            ? queryStringIndex
            : this.emailAddress.indexOf(queryStringParamKey.toLowerCase());

        /* istanbul ignore else */
        if (queryStringIndex > -1) {
          this.subject = decodeURI(this.emailAddress).slice(
            queryStringIndex + queryStringParamKey.length
          );
          this.emailAddress = this.emailAddress.slice(0, queryStringIndex);
        }

        // Set active tab to email
        this.activeTab = 1;
      } else {
        (this.url = modalContext.urlResult.url),
          (this.target = modalContext.urlResult.target as any);

        // set active tab to web page
        this.activeTab = 0;
      }
    }
  }

  public activeTabChanged(value: number): void {
    this.activeTab = value;
  }

  public save(): void {
    /* istanbul ignore else */
    if (this.isValid()) {
      if (this.activeTab === 0) {
        this.modalInstance.save({
          url: this.url,
          target: this.target
            ? parseInt(this.target as any, undefined)
            : UrlTarget.None,
        } as UrlModalResult);
      } else {
        this.modalInstance.save({
          url: this.getEmailUrl(),
          target: UrlTarget.None,
        } as UrlModalResult);
      }
    }
  }

  public cancel(): void {
    this.modalInstance.cancel();
  }

  private getEmailUrl(): string {
    return (
      emailKey +
      this.emailAddress +
      (this.subject ? '?Subject=' + encodeURI(this.subject) : '')
    );
  }

  private isValid(): boolean {
    if (this.activeTab === 0) {
      return !!this.url && SkyValidation.isUrl(this.url);
    }
    return !!this.emailAddress && SkyValidation.isEmail(this.emailAddress);
  }
}
