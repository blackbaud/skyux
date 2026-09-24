import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyHelpTestingModule,
  SkyInstrumentationTestingController,
  provideSkyInstrumentationTesting,
} from '@skyux/core/testing';
import { SkyCheckboxHarness, SkyInputBoxHarness } from '@skyux/forms/testing';

import { CoreInstrumentationBasicExample } from './example';

describe('Basic instrumentation context example', () => {
  function setupTest(): {
    controller: SkyInstrumentationTestingController;
    loader: HarnessLoader;
  } {
    TestBed.configureTestingModule({
      imports: [CoreInstrumentationBasicExample, SkyHelpTestingModule],
      providers: [
        provideNoopSkyAnimations(),
        provideSkyInstrumentationTesting(),
      ],
    });

    const fixture = TestBed.createComponent(CoreInstrumentationBasicExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();

    return {
      controller: TestBed.inject(SkyInstrumentationTestingController),
      loader,
    };
  }

  async function clickCheckboxHelpInline(loader: HarnessLoader): Promise<void> {
    const harness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'repeat-monthly' }),
    );

    await harness.clickHelpInline();
  }

  it('should track when a user requests help for the gift amount', async () => {
    const { controller, loader } = setupTest();

    const inputBox = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'gift-amount' }),
    );

    await inputBox.clickHelpInline();

    controller.expectEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'gift-amount.html' },
      context: {
        name: 'gift-details',
        detail: { recordId: '280-c-r-w' },
      },
    });
  });

  it('should track when a user requests help from the recurring gift section', async () => {
    const { controller, loader } = setupTest();

    await clickCheckboxHelpInline(loader);

    controller.expectEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'repeat-monthly.html' },
      context: {
        name: 'recurring-gift',
        parent: {
          name: 'gift-details',
          detail: { recordId: '280-c-r-w' },
        },
      },
    });
  });

  it('should track each time a user requests help', async () => {
    const { controller, loader } = setupTest();

    await clickCheckboxHelpInline(loader);
    await clickCheckboxHelpInline(loader);

    controller.expectEventCount(
      {
        eventName: 'sky.help-inline.help-requested',
        eventDetail: { helpKey: 'repeat-monthly.html' },
        context: {
          name: 'recurring-gift',
          parent: {
            name: 'gift-details',
            detail: { recordId: '280-c-r-w' },
          },
        },
      },
      2,
    );
  });
});
