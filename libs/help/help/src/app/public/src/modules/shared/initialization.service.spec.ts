import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { BBHelpClient } from '@blackbaud/help-client';

import { HelpInitializationService } from './initialization.service';

describe('Initialization Service', () => {
  const initializationService = new HelpInitializationService();

  beforeEach(() => {
    spyOn(BBHelpClient, 'load').and.callFake((config: any) => { });
  });

  it('should call the Client\'s load method with the config passed to the service', () => {
    const mockConfig = { 'productId': 'test_id' };
    initializationService.load(mockConfig);
    expect(BBHelpClient.load).toHaveBeenCalledWith(mockConfig);
  });
});
