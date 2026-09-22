import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyHelpTestingModule,
  SkyInstrumentationUserEventTestingController,
  provideSkyInstrumentationUserEventTesting,
} from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { CoreInstrumentationModalExample } from './example';

describe('Instrumentation context forwarded to a modal', () => {
  function setupTest(): {
    controller: SkyInstrumentationUserEventTestingController;
    fixture: ComponentFixture<CoreInstrumentationModalExample>;
    rootLoader: HarnessLoader;
  } {
    TestBed.configureTestingModule({
      imports: [CoreInstrumentationModalExample, SkyHelpTestingModule],
      providers: [
        provideNoopSkyAnimations(),
        provideSkyInstrumentationUserEventTesting(),
      ],
    });

    const fixture = TestBed.createComponent(CoreInstrumentationModalExample);

    fixture.detectChanges();

    return {
      controller: TestBed.inject(SkyInstrumentationUserEventTestingController),
      fixture,
      rootLoader: TestbedHarnessEnvironment.documentRootLoader(fixture),
    };
  }

  it('should attach the context of the opening component to a user event raised in the modal', async () => {
    const { controller, fixture, rootLoader } = setupTest();

    const launchButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    );

    launchButton?.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const helpInline = await rootLoader.getHarness(SkyHelpInlineHarness);

    await helpInline.click();

    controller.expectUserEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'edit-gift.html' },
      context: { recordId: '280-c-r-w' },
    });
  });
});
