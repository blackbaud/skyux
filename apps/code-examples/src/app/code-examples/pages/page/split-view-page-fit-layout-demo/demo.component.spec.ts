import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { DemoComponent } from './demo.component';

describe('Split view page fit layout demo', async () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);

    return { pageHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule, RouterTestingModule],
    });
  });

  it('should have a fit layout', async () => {
    const { pageHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('fit');
  });
});
