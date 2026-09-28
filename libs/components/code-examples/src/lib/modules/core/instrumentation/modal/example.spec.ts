import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyHelpTestingModule,
  SkyInstrumentationTestingController,
  provideSkyInstrumentationTesting,
} from '@skyux/core/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { CoreInstrumentationModalExample } from './example';

describe('Instrumentation context forwarded to a modal', () => {
  function setupTest(): {
    controller: SkyInstrumentationTestingController;
    fixture: ComponentFixture<CoreInstrumentationModalExample>;
    rootLoader: HarnessLoader;
  } {
    TestBed.configureTestingModule({
      imports: [CoreInstrumentationModalExample, SkyHelpTestingModule],
      providers: [
        provideNoopSkyAnimations(),
        provideSkyInstrumentationTesting(),
      ],
    });

    const fixture = TestBed.createComponent(CoreInstrumentationModalExample);

    fixture.detectChanges();

    return {
      controller: TestBed.inject(SkyInstrumentationTestingController),
      fixture,
      rootLoader: TestbedHarnessEnvironment.documentRootLoader(fixture),
    };
  }

  it('should track when a user requests help from the edit gift modal', async () => {
    const { controller, fixture, rootLoader } = setupTest();

    const launchButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    );

    launchButton?.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const modal = await rootLoader.getHarness(SkyModalHarness);

    await modal.clickHelpInline();

    controller.expectEvent({
      eventName: 'sky.help-inline.help-requested',
      eventDetail: { helpKey: 'edit-gift.html' },
      context: { name: 'edit-gift', detail: { recordId: '280-c-r-w' } },
    });
  });
});
