import { SkyA11yAnalyzer } from './a11y-analyzer';

describe('A11y analyzer', () => {
  it('should handle axe errors', () => {
    const analyzer = SkyA11yAnalyzer['analyzer'];

    SkyA11yAnalyzer['analyzer'] = {
      run(element: any, config: any, callback: any): void {
        callback(new Error('some error'));
      }
    };

    SkyA11yAnalyzer.run().catch((err) => {
      expect(err.message).toEqual('some error');
    });

    SkyA11yAnalyzer['analyzer'] = analyzer;
  });
});
