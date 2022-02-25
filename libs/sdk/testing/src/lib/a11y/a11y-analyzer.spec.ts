import * as axe from 'axe-core';

import { SkyA11yAnalyzer } from './a11y-analyzer';

describe('A11y analyzer', () => {
  it('should handle axe errors', () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback
    ): void {
      callback(new Error('some error'), {} as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    SkyA11yAnalyzer.run().catch((err) => {
      expect(err.message).toEqual('some error');
    });
  });
});
