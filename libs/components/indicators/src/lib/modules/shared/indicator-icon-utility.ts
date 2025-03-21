import { SkyIndicatorIconType } from './indicator-icon-type';

/**
 * @internal
 */
export class SkyIndicatorIconUtility {
  public static getIconNameForType(
    indicatorType: SkyIndicatorIconType,
  ): string {
    let icon: string;

    switch (indicatorType) {
      case 'danger':
      case 'warning':
        icon = 'warning';
        break;
      case 'info':
        icon = 'info';
        break;
      case 'success':
        icon = 'success';
        break;
    }

    return icon;
  }
}
