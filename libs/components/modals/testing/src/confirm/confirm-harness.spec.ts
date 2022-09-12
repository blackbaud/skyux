import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig,
  SkyConfirmInstance,
  SkyConfirmModule,
  SkyConfirmService,
  SkyConfirmType,
} from '@skyux/modals';

import { SkyConfirmHarness } from './confirm-harness';

const DEFAULT_CONFIRM_CONFIG = {
  message: 'Confirm header',
  type: SkyConfirmType.OK,
};

//#region Test component
@Component({
  selector: 'sky-confirm-test',
  template: `
    <button
      aria-haspopup="dialog"
      class="sky-btn sky-btn-default sky-margin-inline-sm open-btn"
      type="button"
      (click)="openConfirm()"
    >
      Open confirm
    </button>
  `,
})
class TestComponent {
  constructor(confirmService: SkyConfirmService) {
    this.#confirmSvc = confirmService;
  }
  #confirmSvc: SkyConfirmService;

  public config: SkyConfirmConfig = DEFAULT_CONFIRM_CONFIG;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public closedChange(args: SkyConfirmCloseEventArgs) {
    // Only exists for the spy.
  }

  public openConfirm(): void {
    const dialog: SkyConfirmInstance = this.#confirmSvc.open(this.config);

    dialog.closed.subscribe((result) => {
      this.closedChange(result);
    });
  }
}
//#endregion Test component

describe('Confirm harness', () => {
  async function setupTest(config?: SkyConfirmConfig) {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [RouterTestingModule, SkyConfirmModule],
    });

    const fixture = TestBed.createComponent(TestComponent);

    if (config) {
      fixture.componentInstance.config = config;
      fixture.detectChanges();
    }

    const openBtn = fixture.nativeElement.querySelector('.open-btn');
    openBtn.click();
    fixture.detectChanges();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const confirmHarness = await rootLoader.getHarness(SkyConfirmHarness);

    return { confirmHarness, fixture };
  }

  describe('getMessage', () => {
    it('should return the message in the confirm header', async () => {
      const message = 'Confirm message test';
      const { confirmHarness } = await setupTest({
        message,
        type: SkyConfirmType.OK,
      });

      const messageText = await confirmHarness.getMessageText();
      expect(messageText).toEqual(message);
    });
  });

  describe('getBody', () => {
    it('should return undefined when no body was set in the config', async () => {
      const { confirmHarness } = await setupTest();
      const bodyText = await confirmHarness.getBodyText();

      expect(bodyText).toBeUndefined();
    });

    it('should return the body text set in the config', async () => {
      const body = 'body text';
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        body,
      });
      const bodyText = await confirmHarness.getBodyText();

      expect(bodyText).toEqual(body);
    });
  });

  describe('getType', () => {
    it('should return `OK` when the confirm type is set to `OK`', async () => {
      const { confirmHarness } = await setupTest();
      const type = await confirmHarness.getType();

      expect(type).toEqual(SkyConfirmType.OK);
    });

    it('should return `Custom` when the confirm type is custom', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [{ text: 'Proceed', action: 'proceed' }],
      });
      const type = await confirmHarness.getType();

      expect(type).toEqual(SkyConfirmType.Custom);
    });
  });

  describe('getWhiteSpaceIsPreserved', () => {
    it('should return false when whitespace is not preserved', async () => {
      const { confirmHarness } = await setupTest();

      const isPreserved = await confirmHarness.getWhiteSpaceIsPreserved();

      expect(isPreserved).toBeFalse();
    });
    it('should return true when whitespace is preserved', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        preserveWhiteSpace: true,
      });

      const isPreserved = await confirmHarness.getWhiteSpaceIsPreserved();

      expect(isPreserved).toBeTrue();
    });
  });

  describe('clickOKButton', () => {
    it('should ouput a closed event', async () => {
      const { confirmHarness, fixture } = await setupTest();
      const closedSpy = spyOn(fixture.componentInstance, 'closedChange');
      fixture.detectChanges();

      await confirmHarness.clickOKConfirmButton();

      expect(closedSpy).toHaveBeenCalledWith({
        action: 'ok',
      });
    });

    it('should throw an error when used with a custom confirm', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [{ text: 'Proceed', action: 'proceed' }],
      });

      await expectAsync(
        confirmHarness.clickOKConfirmButton()
      ).toBeRejectedWithError(
        '`clickOKButton` should only be used with confirm components with type `OK`'
      );
    });
  });

  describe('clickCustomButtonByText', () => {
    it('should ouput a closed event when a button is clicked', async () => {
      const { confirmHarness, fixture } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          { text: 'Proceed', action: 'proceed' },
          { text: 'Cancel', action: 'cancel' },
        ],
      });
      const closedSpy = spyOn(fixture.componentInstance, 'closedChange');
      fixture.detectChanges();

      await confirmHarness.clickCustomButtonByText('Cancel');

      expect(closedSpy).toHaveBeenCalledWith({
        action: 'cancel',
      });
    });

    it('should throw an error when used with an OK confirm', async () => {
      const { confirmHarness } = await setupTest();

      await expectAsync(
        confirmHarness.clickCustomButtonByText('OK')
      ).toBeRejectedWithError(
        '`clickCustomButtonByText` should only be used with confirm components with type `Custom`'
      );
    });

    it('should throw an error when a button with the given text is not present', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [{ text: 'Proceed', action: 'proceed' }],
      });

      await expectAsync(
        confirmHarness.clickCustomButtonByText('Cancel')
      ).toBeRejectedWithError('No button was found with the text "Cancel"');
    });
  });
});
