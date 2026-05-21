import { ChartKeys, isActivationKey, isNavigationKey } from './keys';

describe('keys', () => {
  describe('isActivationKey', () => {
    it('should return true for Space', () => {
      expect(isActivationKey(ChartKeys.Activation.Space)).toBeTrue();
    });

    it('should return true for Enter', () => {
      expect(isActivationKey(ChartKeys.Activation.Enter)).toBeTrue();
    });

    it('should return false for non-activation keys', () => {
      expect(isActivationKey('ArrowUp')).toBeFalse();
    });
  });

  describe('isNavigationKey', () => {
    it('should return true for ArrowUp', () => {
      expect(isNavigationKey(ChartKeys.Navigation.ArrowUp)).toBeTrue();
    });

    it('should return true for ArrowDown', () => {
      expect(isNavigationKey(ChartKeys.Navigation.ArrowDown)).toBeTrue();
    });

    it('should return true for ArrowLeft', () => {
      expect(isNavigationKey(ChartKeys.Navigation.ArrowLeft)).toBeTrue();
    });

    it('should return true for ArrowRight', () => {
      expect(isNavigationKey(ChartKeys.Navigation.ArrowRight)).toBeTrue();
    });

    it('should return false for non-navigation keys', () => {
      expect(isNavigationKey('Enter')).toBeFalse();
    });
  });
});
