import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingModule,
  SkyInstrumentationUserEventTestingController,
  provideSkyInstrumentationUserEventTesting,
} from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { CoreInstrumentationBasicExample } from './example';

describe('Basic instrumentation context example', () => {
  function setupTest(): {
    controller: SkyInstrumentationUserEventTestingController;
    loader: HarnessLoader;
  } {
    TestBed.configureTestingModule({
      imports: [CoreInstrumentationBasicExample, SkyHelpTestingModule],
      providers: [provideSkyInstrumentationUserEventTesting()],
    });

    const fixture = TestBed.createComponent(CoreInstrumentationBasicExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();

    return {
      controller: TestBed.inject(SkyInstrumentationUserEventTestingController),
      loader,
    };
  }

  it('should attach the page context to a help inline user event', async () => {
    const { controller, loader } = setupTest();

    const helpInline = await loader.getHarness(
      SkyHelpInlineHarness.with({ dataSkyId: 'page-help' }),
    );

    await helpInline.click();

    controller.expectUserEvent({
      eventName: 'sky.help-inline.help-requested',
      eventProperties: { helpKey: 'constituent-summary.html' },
      context: { pageId: 'constituent-summary' },
    });
  });

  it('should merge a nested context with the context above it', async () => {
    const { controller, loader } = setupTest();

    const helpInline = await loader.getHarness(
      SkyHelpInlineHarness.with({ dataSkyId: 'section-help' }),
    );

    await helpInline.click();

    controller.expectUserEvent({
      eventName: 'sky.help-inline.help-requested',
      eventProperties: { helpKey: 'giving-history.html' },
      context: {
        pageId: 'constituent-summary',
        sectionId: 'giving-history',
      },
    });
  });

  it('should emit one user event per help inline click', async () => {
    const { controller, loader } = setupTest();

    const helpInline = await loader.getHarness(
      SkyHelpInlineHarness.with({ dataSkyId: 'section-help' }),
    );

    await helpInline.click();
    await helpInline.click();

    controller.expectUserEventCount(
      {
        eventName: 'sky.help-inline.help-requested',
        eventProperties: { helpKey: 'giving-history.html' },
        context: {
          pageId: 'constituent-summary',
          sectionId: 'giving-history',
        },
      },
      2,
    );
  });
});
