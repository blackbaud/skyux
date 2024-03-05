import {
  TaskConfiguration,
  TaskConfigurationGenerator,
} from '@angular-devkit/schematics';

export interface AgGridCodemodTaskOptions {
  /**
   * The source root of the project.
   */
  sourceRoot: string;
}

export class AgGridCodemodTask implements TaskConfigurationGenerator<unknown> {
  toConfiguration(): TaskConfiguration<AgGridCodemodTaskOptions> {
    return {
      // eslint-disable-next-line @cspell/spellchecker
      name: 'run-ag-grid-codemod',
      options: {
        sourceRoot: 'sourceRoot',
      },
    };
  }
}
