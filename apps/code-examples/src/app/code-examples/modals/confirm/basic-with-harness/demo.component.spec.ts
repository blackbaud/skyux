import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyConfirmHarness } from '@skyux/modals/testing';

import { DemoComponent } from './demo.component';

describe('Testing with SkyConfirmHarness', () => {
  async function setupTest(confirmBtnClass: string): Promise<{
    confirmHarness: SkyConfirmHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const openBtn = fixture.nativeElement.querySelector(confirmBtnClass);

    openBtn.click();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const confirmHarness = await rootLoader.getHarness(SkyConfirmHarness);

    return { confirmHarness, fixture };
  }

  function expectDisplayedText(
    fixture: ComponentFixture<DemoComponent>,
    expectedText: string,
  ): void {
    expect(
      fixture.nativeElement.querySelector('.displayed-text')?.innerText,
    ).toEqual(expectedText);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
    });
  });

  it('should show the correct text when OK is clicked on an OK confirm', async () => {
    const { confirmHarness, fixture } = await setupTest('.ok-confirm-btn');

    await confirmHarness.clickOkButton();

    expectDisplayedText(fixture, 'You selected the "ok" action.');

    await expectAsync(confirmHarness.getMessageText()).toBeResolvedTo(
      'Cannot delete invoice because it has vendor, credit memo, or purchase order activity.',
    );
  });

  it('should show the correct text when "Finalize" is clicked on a custom confirm', async () => {
    const { confirmHarness, fixture } = await setupTest(
      '.two-action-confirm-btn',
    );

    await confirmHarness.clickCustomButton({ text: 'Finalize' });

    expectDisplayedText(
      fixture,
      'You selected the "Finalize" button, which has an action of "save."',
    );

    await expectAsync(confirmHarness.getMessageText()).toBeResolvedTo(
      'Finalize report cards?',
    );

    await expectAsync(confirmHarness.getBodyText()).toBeResolvedTo(
      'Grades cannot be changed once the report cards are finalized.',
    );
  });
});
