import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { SkyVerticalTabsetHarness } from './vertical-tabset-harness';

@Component({
  standalone: true,
  imports: [SkyVerticalTabsetModule],
  template: `
    <sky-vertical-tabset>
      <sky-vertical-tab [tabHeading]="tabHeading" (close)="tabAction()">
        Tab 1 Content
      </sky-vertical-tab>
      <sky-vertical-tab [tabHeading]="'Tab 2'">
        Tab 2 Content
      </sky-vertical-tab>
      <sky-vertical-tab [tabHeading]="'Tab 3'">
        Tab 3 Content
      </sky-vertical-tab>
      <sky-vertical-tab [tabHeading]="'Disabled tab'" [disabled]="true" />
    </sky-vertical-tabset>
  `,
})
class TestComponent {
  public tabHeading: string | undefined = 'Tab 1';

  public tabAction(): void {
    // This function is for the spy.
  }
}

describe('Vertical Tabset harness', () => {
  async function setupTest(): Promise<{
    tabsetHarness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const tabsetHarness = await loader.getHarness(SkyVerticalTabsetHarness);

    return { tabsetHarness, fixture };
  }
});
