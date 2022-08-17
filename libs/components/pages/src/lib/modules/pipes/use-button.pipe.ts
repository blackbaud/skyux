import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'useButton',
})
export class UseButtonPipe implements PipeTransform {
  transform(value: unknown): boolean {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if ('click' in value) {
        return (typeof value['click'] === 'function' &&
          !value['url'] &&
          !value['route']) as boolean;
      }
    }
    return false;
  }
}
