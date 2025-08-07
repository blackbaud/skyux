import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyHelpInlineHarness } from './help-inline-harness';

//#region Test Component
@Component({
  selector: 'sky-help-inline-test',
  template: `
    <sky-help-inline (actionClick)="onActionClick()"></sky-help-inline>
    <sky-help-inline
      data-sky-id="help-inline"
      (actionClick)="otherClick()"
    ></sky-help-inline>
  `,
  standalone: false,
})
class TestComponent {
  public onActionClick(): void {
    // Only exists for the spy
  }
  public otherClick(): void {
    // Only exists for the spy
  }
}
// #endregion Test Component

describe('Inline help harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyHelpInlineModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let helpInlineHarness: SkyHelpInlineHarness;

    if (options.dataSkyId) {
      helpInlineHarness = await loader.getHarness(
        SkyHelpInlineHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      helpInlineHarness = await loader.getHarness(SkyHelpInlineHarness);
    }

    return { helpInlineHarness, fixture, loader };
  }

  it('should click inline help button', async () => {
    const { helpInlineHarness, fixture } = await setupTest();
    const actionClickSpy = spyOn(fixture.componentInstance, 'onActionClick');
    await helpInlineHarness.click();
    expect(actionClickSpy).toHaveBeenCalled();
  });

  it('should get the help inline from its data-sky-id', async () => {
    const { helpInlineHarness, fixture } = await setupTest({
      dataSkyId: 'help-inline',
    });
    const clickSpy = spyOn(fixture.componentInstance, 'otherClick');
    await helpInlineHarness.click();
    expect(clickSpy).toHaveBeenCalled();
  });
});
