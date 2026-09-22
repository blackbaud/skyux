import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture: ComponentFixture<CoreInstrumentationBasicExample>;
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
      fixture,
      loader,
    };
  }

  function clickTrackedButton(
    fixture: ComponentFixture<CoreInstrumentationBasicExample>,
  ): void {
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('[data-sky-id="my-tracked-button"]')
      ?.click();

    fixture.detectChanges();
  }

  it('should attach the page context to a help inline user event', async () => {
    const { controller, loader } = setupTest();

    const helpInline = await loader.getHarness(
      SkyHelpInlineHarness.with({ dataSkyId: 'page-help' }),
    );

    await helpInline.click();

    controller.expectUserEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'constituent-summary.html' },
      context: { pageId: 'constituent-summary' },
    });
  });

  it('should merge a nested context with the context above it', () => {
    const { controller, fixture } = setupTest();

    clickTrackedButton(fixture);

    controller.expectUserEvent({
      eventName: 'foo.bar',
      eventDetail: { some: 'foo' },
      context: {
        pageId: 'constituent-summary',
        sectionId: 'giving-history',
      },
    });
  });

  it('should emit one user event per tracked click', () => {
    const { controller, fixture } = setupTest();

    clickTrackedButton(fixture);
    clickTrackedButton(fixture);

    controller.expectUserEventCount(
      {
        eventName: 'foo.bar',
        eventDetail: { some: 'foo' },
        context: {
          pageId: 'constituent-summary',
          sectionId: 'giving-history',
        },
      },
      2,
    );
  });
});
