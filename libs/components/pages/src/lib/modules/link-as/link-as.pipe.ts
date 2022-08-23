import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkAs',
})
export class LinkAsPipe implements PipeTransform {
  public transform(
    value: unknown,
    linkAs: 'button' | 'href' | 'skyHref' | 'skyAppLink'
  ): boolean {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      switch (linkAs) {
        case 'button':
          if ('click' in value) {
            return (typeof value['click'] === 'function' &&
              !value['url'] &&
              !value['route']) as boolean;
          }
          break;
        case 'href':
          if ('url' in value) {
            return (value['url'] && !value['url'].includes('://')) as boolean;
          }
          break;
        case 'skyHref':
          if ('route' in value) {
            return (value['route'] && !value['url']) as boolean;
          }
          break;
        case 'skyAppLink':
          if ('route' in value) {
            return (value['route'] && !value['url']) as boolean;
          }
          break;
      }
    }
    return false;
  }
}
