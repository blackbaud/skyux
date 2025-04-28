import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInlineFormHarness } from '@skyux/inline-form/testing';

import { InlineFormCustomButtonsExampleComponent } from './example.component';

describe('Inline form custom button demo', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyInlineFormHarness;
    fixture: ComponentFixture<InlineFormCustomButtonsExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [InlineFormCustomButtonsExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      InlineFormCustomButtonsExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyInlineFormHarness.with({ dataSkyId: options.dataSkyId }),
    );
    return { harness, fixture };
  }

  it('should change the first name', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'first-name',
    });

    // You can query components inside the inline form when closed.
    const editButton = await harness.querySelector('button.sky-btn');
    await editButton.click();

    await expectAsync(harness.isFormExpanded()).toBeResolvedTo(true);

    // You can query inline form buttons when the form is open.
    const buttons = await harness.getButtons();
    expect(
      fixture.componentInstance.formGroup.controls['firstName'].value,
    ).toBe('Jane');
    await expectAsync(buttons[0].getText()).toBeResolvedTo('Save');
    await expectAsync(buttons[1].getStyleType()).toBeResolvedTo('default');

    // You can query components from the inline form template when the form is open.
    const inputHarness = await (
      await harness.getTemplate()
    ).querySelector('input');

    await inputHarness.sendKeys('t');
    await inputHarness.blur();
    fixture.detectChanges();

    await buttons[0].click();
    await expectAsync(harness.isFormExpanded()).toBeResolvedTo(false);

    await editButton.click();
    fixture.detectChanges();
    expect(
      fixture.componentInstance.formGroup.controls['firstName'].value,
    ).toBe('Janet');
  });
});
