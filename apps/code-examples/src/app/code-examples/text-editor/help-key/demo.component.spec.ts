import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { DemoComponent } from './demo.component';

describe('Text editor', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DemoComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);

    const helpController = TestBed.inject(SkyHelpTestingController);

    fixture.detectChanges();

    return { fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, SkyHelpTestingModule],
    });
  });

  it('should have the correct help key', async () => {
    const { fixture, helpController } = await setupTest();

    const helpButton = fixture.nativeElement.querySelector(
      'sky-help-inline button',
    );
    helpButton.click();

    helpController.expectCurrentHelpKey('email-help');
  });
});
