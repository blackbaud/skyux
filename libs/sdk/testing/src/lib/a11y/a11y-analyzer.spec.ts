import { waitForAsync } from '@angular/core/testing';

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

    SkyA11yAnalyzer.run('element').catch((err) => {
      expect(err.message).toEqual('some error');
    });
  });

  it('should filter known ag-grid axe errors', waitForAsync(() => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback
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

    SkyA11yAnalyzer.run('element').then(() => {
      expect(true).toBe(true);
    });
  }));

  it('should return detailed results', waitForAsync(() => {
    function mockRun(
      context: axe.ElementContext,
      options: axe.RunOptions,
      callback: axe.RunCallback
    ): void {
      callback(new Error(), {
        violations: [
          {
            id: 'aria-valid-attr',
            tags: ['wcag2a', 'wcag412'],
            nodes: [
              {
                target: ['div.other-header'],
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
            ],
          },
        ],
      } as axe.AxeResults);
    }

    spyOn(SkyA11yAnalyzer['analyzer'], 'run').and.callFake(mockRun as any);

    SkyA11yAnalyzer.run('element')
      .then(() => {
        fail('Other: Expected error to be thrown');
      })
      .catch((result) => {
        expect(result).toMatch(
          /<div class="other-header" aria-description="test"><\/div>/
        );
      });
  }));

  it('should handle undefined elements', () => {
    expect(() => SkyA11yAnalyzer.run()).toThrowError(
      'No element was specified for accessibility checking.'
    );
  });
});
