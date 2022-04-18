import { SkyIndicatorIcon } from './indicator-icon';
import { SkyIndicatorIconType } from './indicator-icon-type';

/**
 * @internl
 */
export class SkyIndicatorIconUtility {
  public static getIconsForType(
    indicatorType: SkyIndicatorIconType
  ): SkyIndicatorIcon {
    let icon: string;
    let baseIcon: string;
    let topIcon: string;

    switch (indicatorType) {
      case 'danger':
      case 'warning':
        icon = 'warning';
        baseIcon = 'triangle-solid';
        topIcon = 'exclamation';
        break;
      case 'info':
        icon = 'exclamation-circle';
        baseIcon = 'circle-solid';
        topIcon = 'help-i';
        break;
      case 'success':
        icon = 'check';
        baseIcon = 'circle-solid';
        topIcon = 'check';
        break;
    }

    return {
      defaultThemeIcon: icon,
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
