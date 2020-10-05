import {
  Component,
  Input,
  OnInit,
  ContentChild
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyErrorTitleComponent
} from './error-title.component';

import {
  SkyErrorDescriptionComponent
} from './error-description.component';

/**
 * Displays a SKY UX-themed error message.
 */
@Component({
  selector: 'sky-error',
  styleUrls: ['./error.component.scss'],
  templateUrl: './error.component.html'
})
export class SkyErrorComponent implements OnInit {
/**
 * Specifies an error type to use a set of pre-defined values for the image,
 * title, and description. The valid options are `'broken'`, `'construction'`,
 * `'notfound'`, and `'security'`.
 */
  @Input()
  public set errorType(value: string) {
    this._errorType = value;
    this.setErrorTypeFields();
  }

  public get errorType() {
    return this._errorType;
  }

/**
 * Indicates whether to display the error image.
 * @default true
 */
  @Input()
  public showImage: boolean = true;

  public title: string = undefined;
  public description: string = undefined;

  public get showTitle(): boolean {
    return this.title && !(this.titleCmp && this.titleCmp.replaceDefaultTitle);
  }

  public get showDescription(): boolean {
    return this.description && !(this.descriptionCmp && this.descriptionCmp.replaceDefaultDescription);
  }

  @ContentChild(SkyErrorTitleComponent)
  private titleCmp: SkyErrorTitleComponent;

  @ContentChild(SkyErrorDescriptionComponent)
  private descriptionCmp: SkyErrorDescriptionComponent;

  private _errorType: string;

  constructor(
    private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnInit() {
    if (this.errorType && this.errorType !== '') {
      this.setErrorTypeFields();
    }
  }

  public setErrorTypeFields() {
    if (this.errorType.toLowerCase() === 'broken') {
      this.title = this.getString('skyux_errors_broken_title');
      this.description = this.getString('skyux_errors_broken_description');

    } else if (this.errorType.toLowerCase() === 'notfound') {
      this.title = this.getString('skyux_errors_not_found_title');
      this.description = undefined;

    } else if (this.errorType.toLowerCase() === 'construction') {
      this.title = this.getString('skyux_errors_construction_title');
      this.description = this.getString('skyux_errors_construction_description');

    } else if (this.errorType.toLowerCase() === 'security') {
      this.title = this.getString('skyux_errors_security_title');
      this.description = undefined;
    }
  }

  public showBrokenImage() {
    return this.errorType && this.errorType.toLowerCase() === 'broken';
  }

  public showNotFoundImage() {
    return this.errorType && this.errorType.toLowerCase() === 'notfound';
  }

  public showConstructionImage() {
    return this.errorType && this.errorType.toLowerCase() === 'construction';
  }

  public showSecurityImage() {
    return this.errorType && this.errorType.toLowerCase() === 'security';
  }

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key
    );
  }
}
