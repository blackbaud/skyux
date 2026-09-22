import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture: ComponentFixture<CoreInstrumentationBasicExample>;
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
      fixture,
      loader,
    };
  }

  function clickTrackedButton(
    fixture: ComponentFixture<CoreInstrumentationBasicExample>,
  ): void {
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('[data-sky-id="export-gifts"]')
      ?.click();

    fixture.detectChanges();
  }

  it('should attach the page context to a help inline user event', async () => {
    const { controller, loader } = setupTest();

    const helpInline = await loader.getHarness(
      SkyHelpInlineHarness.with({ dataSkyId: 'page-help' }),
    );

    await helpInline.click();

    controller.expectEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'constituent-summary.html' },
      context: {
        name: 'constituent-summary',
        detail: { recordId: '280-c-r-w' },
      },
    });
  });

  it('should merge a nested context with the context above it', () => {
    const { controller, fixture } = setupTest();

    clickTrackedButton(fixture);

    controller.expectEvent({
      eventName: 'constituents.gifts-exported',
      eventDetail: { format: 'csv' },
      context: {
        name: 'giving-history',
        detail: { recordId: '280-c-r-w' },
      },
    });
  });

  it('should emit one user event per tracked click', () => {
    const { controller, fixture } = setupTest();

    clickTrackedButton(fixture);
    clickTrackedButton(fixture);

    controller.expectEventCount(
      {
        eventName: 'constituents.gifts-exported',
        eventDetail: { format: 'csv' },
        context: {
          name: 'giving-history',
          detail: { recordId: '280-c-r-w' },
        },
      },
      2,
    );
  });
});
