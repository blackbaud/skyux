import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChevronModule } from '@skyux/indicators';

import { SkyChevronHarness } from './chevron-harness';

//#region Test component
@Component({
  selector: 'sky-chevron-test',
  template: `
    <sky-chevron [disabled]="disabled" (directionChange)="directionChange()">
    </sky-chevron>
  `,
  standalone: false,
})
class TestComponent {
  public disabled = false;

  public directionChange(): void {
    // Only exists for the spy.
  }
}
//#endregion Test component

describe('Chevron harness', () => {
  async function setupTest(): Promise<{
    chevronHarness: SkyChevronHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyChevronModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const chevronHarness = await loader.getHarness(SkyChevronHarness);

    return { chevronHarness, fixture, loader };
  }

  it('should toggle the chevron and return the expected direction', async () => {
    const { chevronHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(chevronHarness.getDirection()).toBeResolvedTo('up');

    await chevronHarness.toggle();

    await expectAsync(chevronHarness.getDirection()).toBeResolvedTo('down');
  });

  it('should throw an error when toggling a disabled chevron', async () => {
    const { chevronHarness, fixture } = await setupTest();

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    await expectAsync(chevronHarness.toggle()).toBeRejectedWithError(
      'Could not toggle the checkbox because it is disabled.',
    );
  });
});
