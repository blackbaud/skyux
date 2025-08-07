import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { CoreMediaQueryResponsiveHostExampleComponent } from './example.component';

describe('Media query example', () => {
  function setupTest(): {
    fixture: ComponentFixture<CoreMediaQueryResponsiveHostExampleComponent>;
    mediaController: SkyMediaQueryTestingController;
  } {
    const fixture = TestBed.createComponent(
      CoreMediaQueryResponsiveHostExampleComponent,
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

    const containerWithHostDirective = el.querySelector<HTMLElement>(
      '[data-sky-id="container-w-host-directive"]',
    );

    const containerWithAttrDirective = el.querySelector<HTMLElement>(
      '[data-sky-id="container-w-attr"]',
    );

    mediaController.setBreakpoint('xs');
    fixture.detectChanges();

    expect(containerWithHostDirective).toHaveClass(
      'sky-responsive-container-xs',
    );
    expect(containerWithAttrDirective).toHaveClass(
      'sky-responsive-container-xs',
    );

    mediaController.setBreakpoint('lg');
    fixture.detectChanges();

    expect(containerWithHostDirective).toHaveClass(
      'sky-responsive-container-lg',
    );
    expect(containerWithAttrDirective).toHaveClass(
      'sky-responsive-container-lg',
    );
  });
});
