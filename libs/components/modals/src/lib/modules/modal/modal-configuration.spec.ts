import { SkyModalConfiguration } from './modal-configuration';

describe('Modal configuration', () => {
  let testService: SkyModalConfiguration;
  beforeEach(() => {
    testService = new SkyModalConfiguration();
    testService.fullPage = true;
  });

  it('should have name property fullPage', () => {
    expect(testService.fullPage).toBe(true);
  });
});
