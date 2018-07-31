import {
  SkyWindowRefService
} from './window-ref.service';

describe('Window service', () => {
  it('should return the native window object', () => {
    const windowRef = new SkyWindowRefService();
    expect(windowRef.getWindow().window).toEqual(window);
  });
});
