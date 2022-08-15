import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { OverlayChildTestHarness } from './fixtures/overlay-child-harness';
import { OverlayHarnessTestComponent } from './fixtures/overlay-harness-test.component';
import { OverlayHarnessTestModule } from './fixtures/overlay-harness-test.module';
import { SkyOverlayHarness } from './overlay-harness';

describe('Overlay harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [OverlayHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(OverlayHarnessTestComponent);
    const overlay = fixture.componentInstance.openOverlay();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const overlayHarness = await rootLoader.getHarness(
      SkyOverlayHarness.with({ selector: `#${overlay.id}` })
    );

    return { fixture, overlayHarness };
  }

  it('should query one child harness', async () => {
    const { overlayHarness } = await setupTest();

    const harness = await overlayHarness.queryHarness(OverlayChildTestHarness);

    await expectAsync((await harness.host()).text()).toBeResolvedTo(
      'OVERLAY CHILD 1 CONTENT'
    );
  });

  it('should query children harnesses', async () => {
    const { overlayHarness } = await setupTest();

    const harnesses = await overlayHarness.queryHarnesses(
      OverlayChildTestHarness
    );

    await expectAsync((await harnesses[0].host()).text()).toBeResolvedTo(
      'OVERLAY CHILD 1 CONTENT'
    );

    await expectAsync((await harnesses[1].host()).text()).toBeResolvedTo(
      'OVERLAY CHILD 2 CONTENT'
    );
  });

  it('should query one child test element', async () => {
    const { overlayHarness } = await setupTest();

    const testElement = await overlayHarness.querySelector('li');

    await expectAsync(testElement.hasClass('li-foo')).toBeResolvedTo(true);
  });

  it('should query child test elements', async () => {
    const { overlayHarness } = await setupTest();

    const testElements = await overlayHarness.querySelectorAll('li');

    expect(testElements.length).toEqual(3);
  });
});
