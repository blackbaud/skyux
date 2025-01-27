import { SkyIndicatorIcon } from './indicator-icon';
import { SkyIndicatorIconType } from './indicator-icon-type';

/**
 * @internal
 */
export class SkyIndicatorIconUtility {
  public static getIconsForType(
    indicatorType: SkyIndicatorIconType,
  ): SkyIndicatorIcon {
    let icon: string;
    let baseIcon: string;
    let topIcon: string;

    switch (indicatorType) {
      case 'danger':
      case 'warning':
        icon = 'sky-warning';
        baseIcon = 'triangle-solid';
        topIcon = 'exclamation';
        break;
      case 'info':
        icon = 'sky-info';
        baseIcon = 'circle-solid';
        topIcon = 'help-i';
        break;
      case 'success':
        icon = 'sky-success';
        baseIcon = 'circle-solid';
        topIcon = 'check';
        break;
    }

    return {
      defaultThemeIcon: icon,
      iconName: icon,
      modernThemeBaseIcon: {
        icon: baseIcon,
        iconType: 'skyux',
      },
      modernThemeTopIcon: {
        icon: topIcon,
        iconType: 'skyux',
      },
    };
  }
}
