import {
  Pipe,
  PipeTransform
} from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyIconClassList'
})
export class SkyIconClassListPipe implements PipeTransform {

  public transform(
    icon: string,
    iconType?: string,
    size?: string,
    fixedWidth?: boolean
  ): string[] {
    const classList = iconType === 'skyux' ? ['sky-i-' + icon] : ['fa', 'fa-' + icon];

    if (size) {
      classList.push('fa-' + size);
    }

    if (fixedWidth) {
      classList.push('fa-fw');
    }

    return classList;
  }

}
