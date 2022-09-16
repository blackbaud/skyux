import { Component, Input, OnInit } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyErrorType } from './error-type';
import { SkyErrorService } from './error.service';

/**
 * Displays a SKY UX-themed error message.
 */
@Component({
  selector: 'sky-error',
  styleUrls: ['./error.component.scss'],
  templateUrl: './error.component.html',
  providers: [SkyErrorService],
})
export class SkyErrorComponent implements OnInit {
  /**
   * Specifies a set of pre-defined values for the image,
   * title, and description.
   */
  @Input()
  public set errorType(value: SkyErrorType | undefined) {
    this.#_errorType = value;
    this.setErrorTypeFields();
  }

  public get errorType(): SkyErrorType | undefined {
    return this.#_errorType;
  }

  /**
   * Indicates whether to display the error image.
   * @default true
   */
  @Input()
  public showImage: boolean | undefined = true;

  public defaultTitle: string | undefined;
  public defaultDescription: string | undefined;

  #resourcesSvc: SkyLibResourcesService;

  #_errorType: SkyErrorType | undefined;

  constructor(
    resourcesSvc: SkyLibResourcesService,
    public errorSvc: SkyErrorService
  ) {
    this.#resourcesSvc = resourcesSvc;
  }

  public ngOnInit() {
    if (this.errorType) {
      this.setErrorTypeFields();
    }
  }

  public setErrorTypeFields() {
    switch (this.errorType?.toLowerCase()) {
      case 'broken':
        this.defaultTitle = this.getString('skyux_errors_broken_title');
        this.defaultDescription = this.getString(
          'skyux_errors_broken_description'
        );
        break;
      case 'notfound':
        this.defaultTitle = this.getString('skyux_errors_not_found_title');
        this.defaultDescription = this.getString(
          'skyux_errors_not_found_description'
        );
        break;
      case 'construction':
        this.defaultTitle = this.getString('skyux_errors_construction_title');
        this.defaultDescription = this.getString(
          'skyux_errors_construction_description'
        );
        break;
      case 'security':
        this.defaultTitle = this.getString('skyux_errors_security_title');
        this.defaultDescription = this.getString(
          'skyux_errors_security_description'
        );
        break;
      default:
        this.defaultTitle = this.defaultDescription = undefined;
    }
  }

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.#resourcesSvc.getStringForLocale({ locale: 'en-US' }, key);
  }
}
