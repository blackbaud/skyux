import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyRepeaterHarness,
  SkyRepeaterItemHarness,
} from '@skyux/lists/testing';

import { ListsRepeaterBasicExampleComponent } from './example.component';

describe('Repeater basic example', () => {
  async function setupTest(): Promise<{
    repeaterHarness: SkyRepeaterHarness | null;
    repeaterItems: SkyRepeaterItemHarness[] | null;
    fixture: ComponentFixture<ListsRepeaterBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(ListsRepeaterBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const repeaterHarness = await loader.getHarness(
      SkyRepeaterHarness.with({ dataSkyId: 'repeater-example' }),
    );

    const repeaterItems = await repeaterHarness.getRepeaterItems();

    return { repeaterHarness, repeaterItems, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListsRepeaterBasicExampleComponent],
    });
  });

  it('should display the repeater item contents', async () => {
    const { repeaterItems } = await setupTest();

    const expectedContent = [
      {
        title: 'Call Robert Hernandez  Completed',
        body: 'Robert recently gave a very generous gift. We should call him to thank him.',
      },
      {
        title: 'Send invitation to Spring Ball  Past due',
        body: "The Spring Ball is coming up soon. Let's get those invitations out!",
      },
      {
        title: 'Assign prospects  Due tomorrow',
        body: 'There are 14 new prospects who are not assigned to fundraisers.',
      },
      {
        title: 'Process gift receipts  Due next week',
        body: 'There are 28 recent gifts that are not receipted.',
      },
      {
        title: '',
        body: 'Three other tasks were not displayed',
      }];

    expect(repeaterItems?.length).toBe(expectedContent.length);

    if (repeaterItems) {
      for (let i = 0; i < repeaterItems.length; i++) {
        await expectAsync(repeaterItems[i].getTitleText()).toBeResolvedTo(
          expectedContent[i].title,
        );
        await expectAsync(repeaterItems[i].getContentText()).toBeResolvedTo(
          expectedContent[i].body,
        );
      }
    }
  });
});
