import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'sky-error',
  styleUrls: ['./error.component.scss'],
  templateUrl: './error.component.html'
})
export class SkyErrorComponent implements OnInit {

  // TODO: The following require statement is not recommended, but was done
  // to avoid a breaking change (SkyResources is synchronous, but SkyAppResources is asynchronous).
  // We should switch to using SkyAppResources in the next major release.
  private resources: any = require('!json-loader!.skypageslocales/resources_en_US.json');

  @Input()
  public set errorType(value: string) {
    this._errorType = value;
    this.setErrorTypeFields();
  }

  public get errorType() {
    return this._errorType;
  }

  public title: string = undefined;
  public description: string = undefined;

  private _errorType: string;

  constructor() { }

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

  /**
   * This method is a stand-in for the old SkyResources service from skyux2.
   * TODO: We should consider using Builder's resources service instead.
   * @param key
   */
  private getString(key: string): string {
    return this.resources[key].message;
  }

}
