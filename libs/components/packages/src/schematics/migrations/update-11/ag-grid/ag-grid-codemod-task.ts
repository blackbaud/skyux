import {
  TaskConfiguration,
  TaskConfigurationGenerator,
} from '@angular-devkit/schematics';

// eslint-disable-next-line @cspell/spellchecker
export interface AgGridCodemodTaskOptions {
  /**
   * The source root of the project.
   */
  sourceRoot: string;
}

// eslint-disable-next-line @cspell/spellchecker
export class AgGridCodemodTask implements TaskConfigurationGenerator<unknown> {
  // eslint-disable-next-line @cspell/spellchecker
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
