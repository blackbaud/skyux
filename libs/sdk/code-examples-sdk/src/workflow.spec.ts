import { workflow } from './workflow';

jest.mock('child_process');

describe('workflow', () => {
  function setup() {
    jest.mock('child_process', () => ({
      execSync: jest.fn(),
    }));
    jest.resetAllMocks();
  }

  it('should generate workflow for PR', async () => {
    setup();
    jest
      .requireMock('child_process')
      .execSync.mockReturnValueOnce(
        [
          'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.ts',
          'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.html',
        ].join('\n')
      );
    expect(await workflow('base-branch', 'head-branch')).toEqual([
      {
        paths:
          'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic',
        index: 1,
      },
    ]);
  });

  it('should generate workflow with dependency changes', async () => {
    setup();
    jest
      .requireMock('child_process')
      .execSync.mockReturnValueOnce(
        [
          'libs/sdk/code-examples-sdk/src/generators/build/generator.ts',
          'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.ts',
          'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.html',
        ].join('\n')
      );
    expect(
      (await workflow('base-branch', 'head-branch')).length
    ).toBeGreaterThan(15);
  });

  it('should generate workflow for push', async () => {
    setup();
    expect((await workflow(undefined, undefined)).length).toBeGreaterThan(15);
    expect(jest.requireMock('child_process').execSync).not.toHaveBeenCalled();
  });
});
