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

    const containerWithHostDirective = fixture.debugElement.query(
      By.css('[data-sky-id="container-w-host-directive"]'),
    ).nativeElement;

    const containerWithAttrDirective = fixture.debugElement.query(
      By.css('[data-sky-id="container-w-attr"]'),
    ).nativeElement;

    mediaController.setBreakpoint('xs');
    fixture.detectChanges();

    await mediaController.expectBreakpoint('xs');

    expect(containerWithHostDirective).toHaveClass(
      'sky-responsive-container-xs',
    );
    expect(containerWithAttrDirective).toHaveClass(
      'sky-responsive-container-xs',
    );

    mediaController.setBreakpoint('lg');
    fixture.detectChanges();

    await mediaController.expectBreakpoint('lg');

    expect(containerWithHostDirective).toHaveClass(
      'sky-responsive-container-lg',
    );
    expect(containerWithAttrDirective).toHaveClass(
      'sky-responsive-container-lg',
    );
  });
});
