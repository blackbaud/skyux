import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../../testing/scaffold';

describe('legacy-services.schematic', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../migration-collection.json'),
  );

  async function setupTest(options: { textContent: string }) {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    tree.overwrite('./src/app/app.component.ts', options.textContent);

    return {
      runSchematic: () => runner.runSchematic('legacy-services', {}, tree),
      tree,
    };
  }

  it('should replace services with legacy versions', async () => {
    const { runSchematic } = await setupTest({
      textContent: `import { SkyModalService, SkyModalConfiguration } from '@skyux/modals';
import { SkyModalService as FoobarService } from '@skyux/modals';
import { SkyModalService as ExternalModalService } from '@external/module';
import { SkyModalService as UnusedService } from 'unused';
import { SkyDynamicComponentService } from '@skyux/core';
import {SkyFlyoutService} from '@skyux/flyout';
import {
  SkyToastService
} from '@skyux/toast';

@Component()
export class AppComponent {
  #modalSvc = inject(SkyModalService);
  #foobarSvc = inject(FoobarService);
  #externalSvc = inject(ExternalModalService);

  constructor(private toastSvc: SkyToastService) {}
}

describe('', () => {
  let dynamicComponentServiceSpy: Spy<SkyDynamicComponentService>;
  let modalService: SkyModalService;
  let flyoutService: SkyFlyoutService;

  beforeEach(() => {
    dynamicComponentServiceSpy = createSpyFromClass(
      SkyDynamicComponentService
    );
    modalService = new SkyModalService(dynamicComponentServiceSpy);
    flyoutService = new SkyFlyoutService();

    TestBed.configureTestingModule({
      providers: [
        { provide: SkyModalService, useValue: modalService },
        { provide: SkyFlyoutService, useValue: flyoutService },
      ]
    });
  });
});
`,
    });

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('./src/app/app.component.ts')).toEqual(
      `import { SkyModalLegacyService, SkyModalConfiguration } from '@skyux/modals';
import { SkyModalLegacyService as FoobarService } from '@skyux/modals';
import { SkyModalService as ExternalModalService } from '@external/module';
import { SkyModalService as UnusedService } from 'unused';
import { SkyDynamicComponentLegacyService } from '@skyux/core';
import {SkyFlyoutLegacyService} from '@skyux/flyout';
import {
  SkyToastLegacyService
} from '@skyux/toast';

@Component()
export class AppComponent {
  #modalSvc = inject(SkyModalLegacyService);
  #foobarSvc = inject(FoobarService);
  #externalSvc = inject(ExternalModalService);

  constructor(private toastSvc: SkyToastLegacyService) {}
}

describe('', () => {
  let dynamicComponentServiceSpy: Spy<SkyDynamicComponentLegacyService>;
  let modalService: SkyModalLegacyService;
  let flyoutService: SkyFlyoutLegacyService;

  beforeEach(() => {
    dynamicComponentServiceSpy = createSpyFromClass(
      SkyDynamicComponentLegacyService
    );
    modalService = new SkyModalLegacyService(dynamicComponentServiceSpy);
    flyoutService = new SkyFlyoutLegacyService();

    TestBed.configureTestingModule({
      providers: [
        { provide: SkyModalLegacyService, useValue: modalService },
        { provide: SkyFlyoutLegacyService, useValue: flyoutService },
      ]
    });
  });
});
`,
    );
  });

  it('should not replace similarly named services from external packages', async () => {
    const { runSchematic } = await setupTest({
      textContent: `import {SkyModalService} from '@not-skyux/library';
const svc = new SkyModalService();
`,
    });

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('./src/app/app.component.ts')).toEqual(
      `import {SkyModalService} from '@not-skyux/library';
const svc = new SkyModalService();
`,
    );
  });
});
