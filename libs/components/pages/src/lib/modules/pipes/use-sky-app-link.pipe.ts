import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'useSkyAppLink',
})
export class UseSkyAppLinkPipe implements PipeTransform {
  transform(value: unknown): boolean {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if ('route' in value) {
        return (value['route'] && !value['url']) as boolean;
      }
    }
    return false;
  }
}
