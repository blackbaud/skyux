import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { CoreMediaQueryBasicExampleComponent } from './example.component';

describe('Media query example', () => {
  function setupTest(): {
    fixture: ComponentFixture<CoreMediaQueryBasicExampleComponent>;
    mediaController: SkyMediaQueryTestingController;
  } {
    const fixture = TestBed.createComponent(
      CoreMediaQueryBasicExampleComponent,
    );
    const mediaController = TestBed.inject(SkyMediaQueryTestingController);

    return { fixture, mediaController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyMediaQueryTesting()],
    });
  });

  it('should change the breakpoint', () => {
    const { fixture, mediaController } = setupTest();

    const el = fixture.nativeElement as HTMLElement;

    mediaController.setBreakpoint('xs');
    fixture.detectChanges();

    expect(el.querySelector('.my-nav-mobile')).toBeTruthy();

    mediaController.setBreakpoint('lg');
    fixture.detectChanges();

    expect(el.querySelector('.my-nav-desktop')).toBeTruthy();
  });
});
