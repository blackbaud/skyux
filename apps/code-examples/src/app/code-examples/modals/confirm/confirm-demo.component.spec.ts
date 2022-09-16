import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyConfirmHarness } from '@skyux/modals/testing';

import { ConfirmDemoComponent } from './confirm-demo.component';
import { ConfirmDemoModule } from './confirm-demo.module';

describe('Confirm demo', () => {
  async function setupTest(confirmBtnClass: string) {
    const fixture = TestBed.createComponent(ConfirmDemoComponent);
    const openBtn = fixture.nativeElement.querySelector(confirmBtnClass);

    openBtn.click();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const confirmHarness = await rootLoader.getHarness(SkyConfirmHarness);
    return { confirmHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDemoModule, RouterTestingModule],
    });
  });

  it('should show the correct text when OK is clicked on an OK confirm', async () => {
    const { confirmHarness, fixture } = await setupTest('.ok-confirm-btn');

    await confirmHarness.clickOkButton();

    const displayedTextEl: HTMLElement =
      fixture.nativeElement.querySelector('.displayed-text');

    expect(displayedTextEl.innerText).toEqual('You selected the "ok" action.');
  });

  it('should show the correct text when "Finalize" is clicked on a custom confirm', async () => {
    const { confirmHarness, fixture } = await setupTest(
      '.two-action-confirm-btn'
    );

    await confirmHarness.clickCustomButton({ textContent: 'Finalize' });

    const displayedTextEl: HTMLElement =
      fixture.nativeElement.querySelector('.displayed-text');

    expect(displayedTextEl.innerText).toEqual(
      'You selected the "Finalize" button, which has an action of "save."'
    );
  });
});
