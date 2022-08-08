import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { OverlayHarnessTestComponent } from './fixtures/overlay-harness-test.component';
import { OverlayHarnessTestModule } from './fixtures/overlay-harness-test.module';
import { SkyOverlayHarness } from './overlay.harness';

describe('Overlay harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [OverlayHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(OverlayHarnessTestComponent);
    const overlay = fixture.componentInstance.openOverlay();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const overlayHarness = await rootLoader.getHarness(
      SkyOverlayHarness.with({ id: overlay.id })
    );

    return { fixture, overlayHarness };
  }

  it('should query test elements', async () => {
    const { overlayHarness } = await setupTest();

    const testElements = await overlayHarness.queryAll('li');

    expect(testElements.length).toEqual(3);
  });
});
