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

    const el = fixture.nativeElement as HTMLElement;

    mediaController.setBreakpoint('xs');
    fixture.detectChanges();

    expect(el.querySelector('.my-nav-mobile')).toBeDefined();

    mediaController.setBreakpoint('lg');
    fixture.detectChanges();

    expect(el.querySelector('.my-nav-desktop')).toBeDefined();
  });
});
