import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { DemoComponent } from './demo.component';

describe('Tile dashboard', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DemoComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);

    const helpController = TestBed.inject(SkyHelpTestingController);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return { fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, SkyHelpTestingModule, NoopAnimationsModule],
    });
  });

  it('should have the correct help key for tile 2', async () => {
    const { fixture, helpController } = await setupTest();

    const tile2HelpInline = fixture.nativeElement.querySelector(
      '[data-sky-id="tile-2"] button',
    );
    tile2HelpInline.click();

    helpController.expectCurrentHelpKey('tile-2-help');
  });
});
