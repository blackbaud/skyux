import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyRepeaterHarness,
  SkyRepeaterItemHarness,
} from '@skyux/lists/testing';

import { RepeaterDemoComponent } from './repeater-demo.component';
import { RepeaterDemoModule } from './repeater-demo.module';

describe('Repeater basic demo', () => {
  async function setupTest(): Promise<{
    repeaterHarness: SkyRepeaterHarness | null;
    repeaterItems: SkyRepeaterItemHarness[] | null;
    fixture: ComponentFixture<RepeaterDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(RepeaterDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const repeaterHarness = await loader.getHarness(
      SkyRepeaterHarness.with({ dataSkyId: 'repeater-demo' })
    );

    const repeaterItems = await repeaterHarness.getRepeaterItems();

    return { repeaterHarness, repeaterItems, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RepeaterDemoModule, NoopAnimationsModule],
    });
  });

  it('should display the repeater item contents', async () => {
    const { repeaterItems } = await setupTest();

    const expectedContent = [
      {
        title: 'Call Robert Hernandez  Completed',
        body: 'Robert recently gave a very generous gift.  We should call him to thank him.',
      },
      {
        title: 'Send invitation to Spring Ball  Past due',
        body: "The Spring Ball is coming up soon.  Let's get those invitations out!",
      },
    ];

    for (let i = 0; i < repeaterItems!.length; i++) {
      await expectAsync(repeaterItems![i].getTitleText()).toBeResolvedTo(
        expectedContent[i].title
      );
      await expectAsync(repeaterItems![i].getContentText()).toBeResolvedTo(
        expectedContent[i].body
      );
    }
  });
});
