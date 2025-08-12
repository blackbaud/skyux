import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../../testing/scaffold';

import { convertProgressIndicatorWizardToTabWizard } from './convert-progress-indicator-wizard-to-tab-wizard';

describe('Convert progress indicator wizard to tab wizard', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should convert progress indicator wizard to tab wizard', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        displayMode="horizontal"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-title>
          Set up my connection
        </sky-progress-indicator-title>

        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>

        <sky-progress-indicator-item title="Second step">
          ...
        </sky-progress-indicator-item>

        <sky-progress-indicator-item title="Third step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>


      <sky-progress-indicator-nav-button
        buttonType="previous"
        [progressIndicator]="wizardRef"
      />
      <sky-progress-indicator-nav-button
        buttonType="next"
        [disabled]="!requirementsMet"
        [progressIndicator]="wizardRef"
      />
      <sky-progress-indicator-nav-button
        buttonType="finish"
        buttonText="Finish"
        [progressIndicator]="wizardRef"
        [disabled]="isSaveDisabled"
      />
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {
        public isSaveDisabled = false;
        public updateIndex(event: { activeIndex: number }): void {
          console.log('Active index changed:', event.activeIndex);
        }
        public onSaveClick(event: Event): void {
          console.log('Save clicked:', event);
        }
      }
      `,
    );
    const output = stripIndents`
      <h3 class="sky-margin-stacked-sm">
        Set up my connection
      </h3>
      <sky-tabset tabStyle="wizard"
        #wizardRef
        (activeChange)="updateIndex({ activeIndex: $event })">


        <sky-tab tabHeading="First step">
          ...
        </sky-tab>

        <sky-tab tabHeading="Second step">
          ...
        </sky-tab>

        <sky-tab tabHeading="Third step">
          ...
        </sky-tab>
      </sky-tabset>


      <sky-tabset-nav-button
        buttonType="previous"
        [tabset]="wizardRef" />
      <sky-tabset-nav-button
        buttonType="next"
        [disabled]="!requirementsMet"
        [tabset]="wizardRef" />
      <sky-tabset-nav-button
        buttonType="finish"
        buttonText="Finish"
        [tabset]="wizardRef"
        [disabled]="isSaveDisabled" />
    `;
    await firstValueFrom(
      runner.callRule(
        convertProgressIndicatorWizardToTabWizard({
          project: 'test-app',
          projectPath: '',
          bestEffortMode: true,
          insertTodos: true,
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
  });

  it('should convert progress indicator wizard to tab wizard, maintaining other progress indicators', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        displayMode="horizontal"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-title>
          Set up my connection
        </sky-progress-indicator-title>

        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>

      <sky-progress-indicator #muggleRef>
        <sky-progress-indicator-title>
          Less magical.
        </sky-progress-indicator-title>

        <sky-progress-indicator-item title="🧙‍♂️">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {
        public isSaveDisabled = false;
        public updateIndex(event: { activeIndex: number }): void {
          console.log('Active index changed:', event.activeIndex);
        }
        public onSaveClick(event: Event): void {
          console.log('Save clicked:', event);
        }
      }
      `,
    );
    const output = stripIndents`
      <h3 class="sky-margin-stacked-sm">
        Set up my connection
      </h3>
      <sky-tabset tabStyle="wizard"
        #wizardRef
        (activeChange)="updateIndex({ activeIndex: $event })">


        <sky-tab tabHeading="First step">
          ...
        </sky-tab>
      </sky-tabset>

      <sky-progress-indicator #muggleRef>
        <sky-progress-indicator-title>
          Less magical.
        </sky-progress-indicator-title>

        <sky-progress-indicator-item title="🧙‍♂️">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>
    `;
    await firstValueFrom(
      runner.callRule(
        convertProgressIndicatorWizardToTabWizard({
          project: 'test-app',
          projectPath: '',
          bestEffortMode: true,
          insertTodos: true,
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
  });

  it('should convert progress indicator wizard to tab wizard with module', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        displayMode="horizontal"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-title>
          Set up my connection
        </sky-progress-indicator-title>

        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>

        <sky-progress-indicator-item title="Second step">
          ...
        </sky-progress-indicator-item>

        <sky-progress-indicator-item title="Third step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>


      <sky-progress-indicator-nav-button
        buttonType="previous"
        [progressIndicator]="wizardRef"
      />
      <sky-progress-indicator-nav-button
        buttonType="next"
        [disabled]="!requirementsMet"
        [progressIndicator]="wizardRef"
      />
      <sky-progress-indicator-nav-button
        buttonType="finish"
        buttonText="Finish"
        [progressIndicator]="wizardRef"
        [disabled]="isSaveDisabled"
      />
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        standalone: false,
      })
      export class TestComponent {
        public isSaveDisabled = false;
        public updateIndex(event: { activeIndex: number }): void {
          console.log('Active index changed:', event.activeIndex);
        }
        public onSaveClick(event: Event): void {
          console.log('Save clicked:', event);
        }
      }
      `,
    );
    tree.create(
      'src/app/test.module.ts',
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      import { TestComponent } from './test.component';

      @NgModule({
        imports: [SkyProgressIndicatorModule],
        declarations: [TestComponent],
        exports: [TestComponent],
      })
      export class TestModule {}
      `,
    );
    const output = stripIndents`
      <h3 class="sky-margin-stacked-sm">
        Set up my connection
      </h3>
      <sky-tabset tabStyle="wizard"
        #wizardRef
        (activeChange)="updateIndex({ activeIndex: $event })">


        <sky-tab tabHeading="First step">
          ...
        </sky-tab>

        <sky-tab tabHeading="Second step">
          ...
        </sky-tab>

        <sky-tab tabHeading="Third step">
          ...
        </sky-tab>
      </sky-tabset>


      <sky-tabset-nav-button
        buttonType="previous"
        [tabset]="wizardRef" />
      <sky-tabset-nav-button
        buttonType="next"
        [disabled]="!requirementsMet"
        [tabset]="wizardRef" />
      <sky-tabset-nav-button
        buttonType="finish"
        buttonText="Finish"
        [tabset]="wizardRef"
        [disabled]="isSaveDisabled" />
    `;
    await firstValueFrom(
      runner.callRule(
        convertProgressIndicatorWizardToTabWizard({
          project: 'test-app',
          projectPath: '',
          bestEffortMode: true,
          insertTodos: true,
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
    expect(
      stripIndents`${tree.readText('src/app/test.module.ts')}`,
    ).toMatchSnapshot();
  });

  it('should convert progress indicator wizard to tab wizard with ambiguous module', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        displayMode="horizontal"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        standalone: false,
      })
      export class TestComponent {
        public isSaveDisabled = false;
        public updateIndex(event: { activeIndex: number }): void {
          console.log('Active index changed:', event.activeIndex);
        }
        public onSaveClick(event: Event): void {
          console.log('Save clicked:', event);
        }
      }
      `,
    );
    const output = stripIndents`
      <sky-tabset tabStyle="wizard"
        #wizardRef
        (activeChange)="updateIndex({ activeIndex: $event })">
        <sky-tab tabHeading="First step">
          ...
        </sky-tab>
      </sky-tabset>
    `;
    await firstValueFrom(
      runner.callRule(
        convertProgressIndicatorWizardToTabWizard({
          project: 'test-app',
          projectPath: '',
          bestEffortMode: true,
          insertTodos: true,
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
  });

  it('should do nothing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create('src/app/test.component.html', '<sky-progress-indicator');
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {}
      `,
    );
    await firstValueFrom(
      runner.callRule(
        convertProgressIndicatorWizardToTabWizard({
          project: 'test-app',
          projectPath: '',
          bestEffortMode: true,
          insertTodos: true,
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      '<sky-progress-indicator',
    );
  });

  it('should convert inline template', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule, SkyProgressIndicatorDisplayMode } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-progress-indicator
            #wizardRef
            [displayMode]="displayMode"
            [startingIndex]="1"
            (progressChanges)="updateIndex($event)"
          >
            <sky-progress-indicator-item title="First step">
              ...
            </sky-progress-indicator-item>

            <sky-progress-indicator-item title="Second step">
              ...
            </sky-progress-indicator-item>

            <sky-progress-indicator-item title="Third step">
              ...
            </sky-progress-indicator-item>
          </sky-progress-indicator>


          <sky-progress-indicator-nav-button
            buttonType="previous"
            [progressIndicator]="wizardRef"
          />

          <sky-progress-indicator-nav-button
            buttonType="next"
            [disabled]="!requirementsMet"
            [progressIndicator]="wizardRef"
          ></sky-progress-indicator-nav-button>

          <sky-progress-indicator-nav-button
            buttonType="finish"
            buttonText="Finish"
            [progressIndicator]="wizardRef"
            [disabled]="isSaveDisabled"
          />
        ${backtick},
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {
        protected displayMode = SkyProgressIndicatorDisplayMode.Horizontal;
      }
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import {  SkyProgressIndicatorDisplayMode } from '@skyux/progress-indicator';
      import { SkyTabsModule } from '@skyux/tabs';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-tabset tabStyle="wizard"
            #wizardRef
            [active]="1"
            (activeChange)="updateIndex({ activeIndex: $event })">
            <sky-tab tabHeading="First step">
              ...
            </sky-tab>

            <sky-tab tabHeading="Second step">
              ...
            </sky-tab>

            <sky-tab tabHeading="Third step">
              ...
            </sky-tab>
          </sky-tabset>


          <sky-tabset-nav-button
            buttonType="previous"
            [tabset]="wizardRef" />

          <sky-tabset-nav-button
            buttonType="next"
            [disabled]="!requirementsMet"
            [tabset]="wizardRef"></sky-tabset-nav-button>

          <sky-tabset-nav-button
            buttonType="finish"
            buttonText="Finish"
            [tabset]="wizardRef"
            [disabled]="isSaveDisabled" />
        ${backtick},
        imports: [SkyTabsModule],
      })
      export class TestComponent {
        // todo: Remove. The displayMode property was previous used to determine if the progress indicator should be displayed as a wizard. It is no longer needed.
        protected displayMode = SkyProgressIndicatorDisplayMode.Horizontal;
      }
    `;
    await firstValueFrom(
      runner.callRule(
        convertProgressIndicatorWizardToTabWizard({
          project: 'test-app',
          projectPath: '',
          bestEffortMode: true,
          insertTodos: true,
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should error for message stream', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        [displayMode]="'horizontal'"
        [messageStream]="someStream"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {}
      `,
    );
    await expect(
      firstValueFrom(
        runner.callRule(
          convertProgressIndicatorWizardToTabWizard({
            project: 'test-app',
            projectPath: '',
            bestEffortMode: true,
            insertTodos: true,
          }),
          tree,
        ),
      ),
    ).rejects.toThrow(
      new Error(
        `The <sky-progress-indicator> element in /src/app/test.component.html uses '[messageStream]', which is not supported on the <sky-tabset> component. Please evaluate if '[messageStream]' is still needed.`,
      ),
    );
  });

  it('should error for (actionClick)', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        [displayMode]="1"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>

      <sky-progress-indicator-nav-button
        buttonType="previous"
        [progressIndicator]="wizardRef"
        (actionClick)="doAction($event)"
      />
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {}
      `,
    );
    await expect(
      firstValueFrom(
        runner.callRule(
          convertProgressIndicatorWizardToTabWizard({
            project: 'test-app',
            projectPath: '',
            bestEffortMode: true,
            insertTodos: true,
          }),
          tree,
        ),
      ),
    ).rejects.toThrow(
      new Error(
        `The <sky-progress-indicator-nav-button> element in /src/app/test.component.html uses '(actionClick)', which is not supported on the <sky-tabset-nav-button> component. Please evaluate if '(actionClick)' is still needed.`,
      ),
    );
  });

  it('should error reset button type', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        [displayMode]="1"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>

      <sky-progress-indicator-nav-button
        buttonType="reset"
        [progressIndicator]="wizardRef"
      />
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {}
      `,
    );
    await expect(
      firstValueFrom(
        runner.callRule(
          convertProgressIndicatorWizardToTabWizard({
            project: 'test-app',
            projectPath: '',
            bestEffortMode: true,
            insertTodos: true,
          }),
          tree,
        ),
      ),
    ).rejects.toThrow(
      new Error(
        `The <sky-progress-indicator-nav-button> element in /src/app/test.component.html uses 'buttonType="reset"', which is not supported on the <sky-tabset-nav-button> component. Please evaluate if a reset button is still needed.`,
      ),
    );
  });

  it('should error complex display mode', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
      <sky-progress-indicator
        #wizardRef
        [displayMode]="🤢 + 🤮"
        (progressChanges)="updateIndex($event)"
      ></sky-progress-indicator>
    `,
    );
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {}
      `,
    );
    await expect(
      firstValueFrom(
        runner.callRule(
          convertProgressIndicatorWizardToTabWizard({
            project: 'test-app',
            projectPath: '',
            bestEffortMode: true,
            insertTodos: true,
          }),
          tree,
        ),
      ),
    ).rejects.toThrow(
      new Error(
        `Unable to determine the 'displayMode' attribute on <sky-progress-indicator> in /src/app/test.component.html.`,
      ),
    );
  });

  it('should error when display mode is not initialized', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
      <sky-progress-indicator
        #wizardRef
        [displayMode]="displayMode"
        (progressChanges)="updateIndex($event)"
      ></sky-progress-indicator>
    `,
    );
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyProgressIndicatorModule, SkyProgressIndicatorDisplayMode } from '@skyux/progress-indicator';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        imports: [SkyProgressIndicatorModule],
      })
      export class TestComponent {
        public displayMode: SkyProgressIndicatorDisplayMode;

        constructor() {
          displayMode = SkyProgressIndicatorDisplayMode.Horizontal;
        }
      }
      `,
    );
    await expect(
      firstValueFrom(
        runner.callRule(
          convertProgressIndicatorWizardToTabWizard({
            project: 'test-app',
            projectPath: '',
            bestEffortMode: true,
            insertTodos: true,
          }),
          tree,
        ),
      ),
    ).rejects.toThrow(
      new Error(
        `Unable to determine the value for the 'displayMode' attribute on <sky-progress-indicator> in /src/app/test.component.html.`,
      ),
    );
  });

  it('should error for ambiguous module without bestEffort mode', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-progress-indicator
        #wizardRef
        displayMode="horizontal"
        (progressChanges)="updateIndex($event)"
      >
        <sky-progress-indicator-item title="First step">
          ...
        </sky-progress-indicator-item>
      </sky-progress-indicator>
    `;
    tree.create('src/app/test.component.html', input);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        standalone: false,
      })
      export class TestComponent {
        public isSaveDisabled = false;
        public updateIndex(event: { activeIndex: number }): void {
          console.log('Active index changed:', event.activeIndex);
        }
        public onSaveClick(event: Event): void {
          console.log('Save clicked:', event);
        }
      }
      `,
    );
    await expect(
      firstValueFrom(
        runner.callRule(
          convertProgressIndicatorWizardToTabWizard({
            project: 'test-app',
            projectPath: '',
            bestEffortMode: false,
            insertTodos: false,
          }),
          tree,
        ),
      ),
    ).rejects.toThrow(
      new Error(
        `Could not find the declaring module for the component in /src/app/test.component.ts to add the SkyTabsModule import. The 'bestEffortMode' option is required to continue.`,
      ),
    );
  });
});
