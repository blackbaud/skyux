import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { OverlayHarnessTestComponent } from './fixtures/overlay-harness-test.component';
import { OverlayHarnessTestModule } from './fixtures/overlay-harness-test.module';
import { SkyOverlayHarness } from './overlay.harness';

fdescribe('Overlay harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [OverlayHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(OverlayHarnessTestComponent);
    const contentsComponent = fixture.componentInstance.openOverlay();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const overlayHarness = await loader.getHarness(
      SkyOverlayHarness.with({ id: contentsComponent.id })
    );

    return { overlayHarness };
  }

  it('should query test elements', async () => {
    const { overlayHarness } = await setupTest();
    const testElements = await overlayHarness.queryAll('li');
    expect(testElements.length).toEqual(3);
  });
});
