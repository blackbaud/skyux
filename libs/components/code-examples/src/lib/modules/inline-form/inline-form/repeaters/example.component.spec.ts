import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInlineFormHarness } from '@skyux/inline-form/testing';
import { SkyRepeaterHarness } from '@skyux/lists/testing';

import { InlineFormRepeatersExampleComponent } from './example.component';

describe('Inline form with repeater demo', () => {
  async function setupTest(options: { itemId: number }): Promise<{
    repeaterHarness: SkyRepeaterHarness;
    inlineFormHarness: SkyInlineFormHarness;
    fixture: ComponentFixture<InlineFormRepeatersExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [InlineFormRepeatersExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      InlineFormRepeatersExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const repeaterHarness = await loader.getHarness(SkyRepeaterHarness);
    const item = await repeaterHarness.getRepeaterItems();
    const inlineFormHarness =
      await item[options.itemId].queryHarness(SkyInlineFormHarness);

    return { repeaterHarness, inlineFormHarness, fixture };
  }

  it('should set up the spring gala item inline form', async () => {
    const { inlineFormHarness } = await setupTest({
      itemId: 1,
    });
    const editButton = await inlineFormHarness?.querySelector('button.sky-btn');
    await editButton?.click();
    await expectAsync(inlineFormHarness?.isFormExpanded()).toBeResolvedTo(true);

    // You can query inline form buttons when the form is open.
    const buttons = await inlineFormHarness?.getButtons();
    await expectAsync(buttons[0].getText()).toBeResolvedTo('Save');
    const cancelButton = buttons[1];

    await cancelButton.click();
    await expectAsync(inlineFormHarness?.isFormExpanded()).toBeResolvedTo(
      false,
    );
  });
});
