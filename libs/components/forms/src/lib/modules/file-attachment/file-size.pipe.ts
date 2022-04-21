import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

/**
 * @internal
 */
@Pipe({
  name: 'skyFileSize',
})
export class SkyFileSizePipe implements PipeTransform {
  constructor(
    private decimalPipe: DecimalPipe,
    private resourcesService: SkyLibResourcesService
  ) {}

  public transform(input: number): string {
    let decimalPlaces = 0,
      dividend = 1,
      template: string;

    if (input === null || input === undefined) {
      return '';
    }

    if (Math.abs(input) === 1) {
      template = 'skyux_file_attachment_file_size_b_singular';
    } else if (input < 1000) {
      template = 'skyux_file_attachment_file_size_b_plural';
    } else if (input < 1e6) {
      template = 'skyux_file_attachment_file_size_kb';
      dividend = 1000;
    } else if (input < 1e9) {
      template = 'skyux_file_attachment_file_size_mb';
      dividend = 1e6;
      decimalPlaces = 1;
    } else {
      template = 'skyux_file_attachment_file_size_gb';
      dividend = 1e9;
      decimalPlaces = 1;
    }

    const roundedSize =
      Math.floor(input / (dividend / Math.pow(10, decimalPlaces))) /
      Math.pow(10, decimalPlaces);

    const formattedSize = this.decimalPipe.transform(roundedSize, '.0-3');

    return this.getString(template, formattedSize);
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
