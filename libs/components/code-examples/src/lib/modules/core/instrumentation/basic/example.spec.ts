import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingModule,
  SkyInstrumentationTestingController,
  provideSkyInstrumentationTesting,
} from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { CoreInstrumentationBasicExample } from './example';

describe('Basic instrumentation context example', () => {
  function setupTest(): {
    controller: SkyInstrumentationTestingController;
    loader: HarnessLoader;
  } {
    TestBed.configureTestingModule({
      imports: [CoreInstrumentationBasicExample, SkyHelpTestingModule],
      providers: [provideSkyInstrumentationTesting()],
    });

    const fixture = TestBed.createComponent(CoreInstrumentationBasicExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();

    return {
      controller: TestBed.inject(SkyInstrumentationTestingController),
      loader,
    };
  }

  async function clickHelpInline(
    loader: HarnessLoader,
    dataSkyId: string,
  ): Promise<void> {
    const harness = await loader.getHarness(
      SkyHelpInlineHarness.with({ dataSkyId }),
    );

    await harness.click();
  }

  it('should attach the page context to a help inline event', async () => {
    const { controller, loader } = setupTest();

    await clickHelpInline(loader, 'page-help');

    controller.expectEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'constituent-summary.html' },
      context: {
        name: 'constituent-summary',
        detail: { recordId: '280-c-r-w' },
      },
    });
  });

  it('should attach the nested context and its parent to a help inline event', async () => {
    const { controller, loader } = setupTest();

    await clickHelpInline(loader, 'section-help');

    controller.expectEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'giving-history.html' },
      context: {
        name: 'giving-history',
        parent: {
          name: 'constituent-summary',
          detail: { recordId: '280-c-r-w' },
        },
      },
    });
  });

  it('should emit one event per help inline click', async () => {
    const { controller, loader } = setupTest();

    await clickHelpInline(loader, 'section-help');
    await clickHelpInline(loader, 'section-help');

    controller.expectEventCount(
      {
        eventName: 'sky.help-inline.help-requested',
        eventDetail: { helpKey: 'giving-history.html' },
        context: {
          name: 'giving-history',
          parent: {
            name: 'constituent-summary',
            detail: { recordId: '280-c-r-w' },
          },
        },
      },
      2,
    );
  });
});
