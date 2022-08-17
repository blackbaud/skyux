import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'useHref',
})
export class UseHrefPipe implements PipeTransform {
  transform(value: unknown): boolean {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if ('url' in value) {
        return (value['url'] && !value['url'].includes('://')) as boolean;
      }
    }
    return false;
  }
}
