import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyProgressIndicatorNavButtonClass',
  standalone: false,
})
export class SkyProgressIndicatorNavButtonClass implements PipeTransform {
  public transform(buttonType: string): string[] {
    const classNames = [`sky-progress-indicator-nav-button-${buttonType}`];

    switch (buttonType) {
      case 'next':
      case 'finish':
        classNames.push('sky-btn-primary');
        break;
      case 'reset':
        classNames.push('sky-btn-link');
        break;
      default:
        classNames.push('sky-btn-default');
    }

    return classNames;
  }
}
