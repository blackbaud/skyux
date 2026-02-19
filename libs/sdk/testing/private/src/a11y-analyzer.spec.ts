import axe from 'axe-core';

import { SkyA11yAnalyzer } from './a11y-analyzer';

describe('A11y analyzer', () => {
  it('should handle axe errors', async () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback,
    ): void {
      callback(new Error('some error'), {} as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    try {
      await SkyA11yAnalyzer.run('element');
      fail('Expected error to be thrown');
    } catch (err) {
      expect((err as Error).message).toEqual('some error');
    }
  });

  it('should filter known ag-grid axe errors', async () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback,
    ): void {
      callback(new Error(), {
        violations: [
          {
            id: 'aria-required-children',
            tags: ['wcag2a', 'wcag412'],
            nodes: [
              {
                target: ['div.ag-root'],
                html: '<div class="ag-root" role="grid"></div>',
                any: [],
                all: [
                  {
                    id: 'aria-required-children',
                    data: null,
                    relatedNodes: [
                      {
                        target: ['div.ag-header'],
                        html: '<div class="ag-header" role="presentation"></div>',
                      },
                    ],
                  },
                ] as axe.CheckResult[],
                none: [],
                impact: 'critical',
                failureSummary: 'some failure summary',
              } as axe.NodeResult,
            ],
          },
        ],
      } as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    await SkyA11yAnalyzer.run('element');
  });

  it('should filter error for radiogroup on a fieldset (pre-4.0.0 compat)', async () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback,
    ): void {
      callback(new Error(), {
        violations: [
          {
            id: 'aria-allowed-role',
            tags: ['wcag2a', 'wcag412'],
            nodes: [
              {
                target: ['fieldset'],
                html: '<fieldset role="radiogroup" class="sky-radio-group">',
                any: [],
                all: [],
                none: [],
                impact: 'minor',
                failureSummary: 'some failure summary',
              } as axe.NodeResult,
            ],
          },
        ],
      } as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    await SkyA11yAnalyzer.run('element');
  });

  it('should not filter error for radiogroup on an invalid element', async () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback,
    ): void {
      callback(new Error(), {
        violations: [
          {
            id: 'aria-allowed-role',
            tags: ['wcag2a', 'wcag412'],
            nodes: [
              {
                target: ['p'],
                html: '<p role="radiogroup">',
                any: [],
                all: [],
                none: [],
                impact: 'minor',
                failureSummary: 'some failure summary',
              } as axe.NodeResult,
            ],
          },
        ],
      } as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    try {
      await SkyA11yAnalyzer.run('element');
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toMatch(/<p role="radiogroup">/);
    }
  });

  it('should not filter error for an invalid role on a fieldset element', async () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback,
    ): void {
      callback(new Error(), {
        violations: [
          {
            id: 'aria-allowed-role',
            tags: ['wcag2a', 'wcag412'],
            nodes: [
              {
                target: ['p'],
                html: '<fieldset role="alert">',
                any: [],
                all: [],
                none: [],
                impact: 'minor',
                failureSummary: 'some failure summary',
              } as axe.NodeResult,
            ],
          },
        ],
      } as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    try {
      await SkyA11yAnalyzer.run('element');
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toMatch(/<fieldset role="alert">/);
    }
  });

  it('should return detailed results', async () => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback,
    ): void {
      callback(new Error(), {
        violations: [
          {
            id: 'aria-valid-attr',
            tags: ['wcag2a', 'wcag412'],
            nodes: [
              {
                ancestry: ['original-header'],
                target: [],
                html: '<div class="other-header" aria-description="test"></div>',
                any: [],
                all: [
                  {
                    id: 'aria-valid-attr',
                    data: null,
                  },
                ] as axe.CheckResult[],
                none: [],
              } as axe.NodeResult,
              {
                ancestry: [],
                target: [],
                html: '',
                any: [],
                all: [],
                none: [],
              } as axe.NodeResult,
            ],
          },
        ],
      } as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    try {
      await SkyA11yAnalyzer.run('element');
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toMatch(
        /<div class="other-header" aria-description="test"><\/div>/,
      );
    }
  });

  it('should handle undefined elements', () => {
    expect(() => SkyA11yAnalyzer.run()).toThrowError(
      'No element was specified for accessibility checking.',
    );
  });
});
