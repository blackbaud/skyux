import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

    await mediaController.expectBreakpoint('xs');

    expect(
      fixture.debugElement.query(By.css('.my-nav-mobile')).nativeElement,
    ).toBeDefined();

    mediaController.setBreakpoint('lg');
    fixture.detectChanges();

    await mediaController.expectBreakpoint('lg');

    expect(
      fixture.debugElement.query(By.css('.my-nav-desktop')).nativeElement,
    ).toBeDefined();
  });
});
