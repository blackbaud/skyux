import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { DemoComponent } from './demo.component';

describe('Tree view', () => {
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

    const burmeseNodeHelpInline = fixture.nativeElement.querySelector(
      '[data-sky-id="node-Burmese"] button',
    );
    burmeseNodeHelpInline.click();

    helpController.expectCurrentHelpKey('cat-burmese');
  });
});
