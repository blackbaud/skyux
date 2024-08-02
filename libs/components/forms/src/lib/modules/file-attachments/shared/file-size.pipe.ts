import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

/**
 * @internal
 */
@Pipe({
  name: 'skyFileSize',
  standalone: true,
})
export class SkyFileSizePipe implements PipeTransform {
  #decimalPipe: DecimalPipe;
  #resourcesService: SkyLibResourcesService;

  constructor(
    decimalPipe: DecimalPipe,
    resourcesService: SkyLibResourcesService,
  ) {
    this.#decimalPipe = decimalPipe;
    this.#resourcesService = resourcesService;
  }

  public transform(input?: number | string | null): string {
    let decimalPlaces = 0,
      dividend = 1,
      template: string;

    if (input === null || input === undefined) {
      return '';
    }

    if (typeof input === 'string') {
      input = Number.parseInt(input);
    }

    if (Math.abs(input) === 1) {
      template = 'skyux_file_attachment_file_size_b_singular';
    } else if (input < 1024) {
      template = 'skyux_file_attachment_file_size_b_plural';
    } else if (input < Math.pow(1024, 2)) {
      template = 'skyux_file_attachment_file_size_kb';
      dividend = 1024;
    } else if (input < Math.pow(1024, 3)) {
      template = 'skyux_file_attachment_file_size_mb';
      dividend = Math.pow(1024, 2);
      decimalPlaces = 1;
    } else {
      template = 'skyux_file_attachment_file_size_gb';
      dividend = Math.pow(1024, 3);
      decimalPlaces = 1;
    }

    const roundedSize =
      Math.floor(input / (dividend / Math.pow(10, decimalPlaces))) /
      Math.pow(10, decimalPlaces);

    const formattedSize = this.#decimalPipe.transform(roundedSize, '.0-3');

    return this.#getString(template, formattedSize);
  }

  #getString(key: string, ...args: unknown[]): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.#resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key,
      ...args,
    );
  }
}
