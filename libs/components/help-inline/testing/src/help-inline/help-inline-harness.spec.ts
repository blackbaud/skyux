import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyHelpInlineHarness } from './help-inline-harness';

//#region Test component
@Component({
  selector: 'sky-help-inline-test',
  template: ``,
})
class TestComponent {}
//#endregion Test component

describe('Form errors harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
    pageLoader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyHelpInlineModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const pageLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const helpInlineHarness: SkyHelpInlineHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyHelpInlineHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyHelpInlineHarness);

    return { helpInlineHarness, fixture, loader, pageLoader };
  }
});
