import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { DemoComponent } from './demo.component';

describe('Media query demo', () => {
  function setupTest(): {
    fixture: ComponentFixture<DemoComponent>;
    mediaController: SkyMediaQueryTestingController;
  } {
    const fixture = TestBed.createComponent(DemoComponent);
    const mediaController = TestBed.inject(SkyMediaQueryTestingController);

    return { fixture, mediaController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyMediaQueryTesting()],
    });
  });

  it('should change the breakpoint', async () => {
    const { fixture, mediaController } = setupTest();

    mediaController.setBreakpoint('xs');
    fixture.detectChanges();

    const breakpointEl = fixture.nativeElement.querySelector(
      '[data-sky-id="breakpoint"]',
    );

    await mediaController.expectBreakpoint('xs');
    expect(breakpointEl.textContent).toEqual('xs');

    mediaController.setBreakpoint('lg');
    fixture.detectChanges();

    await mediaController.expectBreakpoint('lg');
    expect(breakpointEl.textContent).toEqual('lg');
  });
});
