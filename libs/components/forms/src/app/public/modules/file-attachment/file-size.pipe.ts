import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  SkyFormat
} from '@skyux/core/modules/format/format';

@Pipe({
  name: 'skyFileSize'
})
export class SkyFileSizePipe implements PipeTransform {

  // TODO: The following require statement is not recommended, but was done
  // to avoid a breaking change (SkyResources is synchronous, but SkyAppResources is asynchronous).
  // We should switch to using SkyAppResources in the next major release.
  private resources: any = require('!json-loader!.skypageslocales/resources_en_US.json');

  public constructor(private decimalPipe: DecimalPipe) {}

  public transform(input: number): string {

    let decimalPlaces = 0,
                dividend = 1,
                formattedSize: string,
                roundedSize: number,
                template: string;

    /* tslint:disable */
    if (input === null || input === undefined) {
        return '';
    }
    /* tslint:enable */

    if (Math.abs(input) === 1) {
      template = this.getString('skyux_file_attachment_file_size_b_singular');
    } else if (input < 1000) {
      template = this.getString('skyux_file_attachment_file_size_b_plural');
    } else if (input < 1e6) {
      template = this.getString('skyux_file_attachment_file_size_kb');
      dividend = 1000;
    } else if (input < 1e9) {
      template = this.getString('skyux_file_attachment_file_size_mb');
      dividend = 1e6;
      decimalPlaces = 1;
    } else {
      template = this.getString('skyux_file_attachment_file_size_gb');
      dividend = 1e9;
      decimalPlaces = 1;
    }

    roundedSize =
      Math.floor(input / (dividend / Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces);

    formattedSize = this.decimalPipe.transform(roundedSize, '.0-3');

    return SkyFormat.formatText(template, formattedSize);
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
