import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyBoxModule } from '@skyux/layout';

import { SkyBoxHarness } from './box-harness';

// #region Test component
@Component({
  selector: 'sky-box-test',
  template: `
    <sky-box
      [ariaRole]="ariaRole"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      ><sky-box> </sky-box
    ></sky-box>
    <sky-box data-sky-id="other-box" [ariaLabel]="otherBox"></sky-box>
  `,
})
class TestBoxComponent {
  public ariaRole: string | undefined;
  public ariaLabel: string | undefined;
  public ariaLabelledBy: string | undefined;
  public otherBox = 'otherBox';
}
// #endregion Test component

describe('Box test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {}
  ): Promise<{
    boxHarness: SkyBoxHarness;
    fixture: ComponentFixture<TestBoxComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestBoxComponent],
      imports: [SkyBoxModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestBoxComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    let boxHarness: SkyBoxHarness;

    if (options.dataSkyId) {
      boxHarness = await loader.getHarness(
        SkyBoxHarness.with({
          dataSkyId: options.dataSkyId,
        })
      );
    } else {
      boxHarness = await loader.getHarness(SkyBoxHarness);
    }

    return { boxHarness, fixture, loader };
  }

  it('should get the box from its data-sky-id', async () => {
    const { boxHarness, fixture } = await setupTest({ dataSkyId: 'other-box' });

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('otherBox');
  });

  it('should get the aria-label', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaLabel = 'aria-label';
    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('aria-label');
  });

  it('should get the aria-labelledby', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaLabelledBy = 'aria-labelledby';
    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabelledby()).toBeResolvedTo(
      'aria-labelledby'
    );
  });

  it('should get the aria-role', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaRole = 'aria-role';
    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaRole()).toBeResolvedTo('aria-role');
  });

  it('should get default values', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabelledby()).toBeResolvedTo(null);
    await expectAsync(boxHarness.getAriaRole()).toBeResolvedTo(null);
    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo(null);
  });
});
