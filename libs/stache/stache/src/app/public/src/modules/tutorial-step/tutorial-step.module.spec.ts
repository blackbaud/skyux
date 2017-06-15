import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialStepModule } from './tutorial-step.module';

describe('StacheTutorialStepModule', () => {
  it('should export', () => {
    const exportedModule = new StacheTutorialStepModule();
    expect(exportedModule).toBeDefined();
  });
});
