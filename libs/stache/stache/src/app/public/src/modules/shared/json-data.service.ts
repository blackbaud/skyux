import { Injectable } from '@angular/core';

@Injectable()
export class StacheJsonDataService {
  // The noop gets populated automatically by JSON file contents.
  // https://github.com/blackbaud/skyux-builder-plugin-stache-parse-json-file
  // (Disabling TSLint for this line because the file contents do not conform to linting rules.)
  /* tslint:disable:quotemark whitespace max-line-length */
  private jsonData: any = 'noop';
  /* tslint:enable:quotemark whitespace max-line-length */

  public getAll(): any {
    return this.jsonData;
  }

  public getByName(name: string): any {
    if (!this.jsonData[name]) {
      return;
    }

    return this.jsonData[name];
  }
}
