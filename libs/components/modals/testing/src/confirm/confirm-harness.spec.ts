import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig,
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
    const dialog = this.#confirmSvc.open(this.config);

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

      const isPreserved = await confirmHarness.isWhiteSpacePreserved();

      expect(isPreserved).toBeFalse();
    });
    it('should return true when whitespace is preserved', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        preserveWhiteSpace: true,
      });

      const isPreserved = await confirmHarness.isWhiteSpacePreserved();

      expect(isPreserved).toBeTrue();
    });
  });

  describe('getCustomButtons', () => {
    it('should query and filter child button harnesses', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            styleType: 'primary',
          },
          {
            text: 'Cancel',
            action: 'cancel',
            styleType: 'link',
          },
        ],
      });

      const results = await confirmHarness.getCustomButtons({
        textContent: 'Proceed',
        styleType: 'primary',
      });

      expect(results.length).toEqual(1);
      await expectAsync(results[0].textContent()).toBeResolvedTo('Proceed');
      await expectAsync(results[0].styleType()).toBeResolvedTo('primary');
    });

    it('should return harnesses for all matching buttons', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            styleType: 'default',
          },
          {
            text: 'Cancel',
            action: 'cancel',
            styleType: 'link',
          },
        ],
      });

      const results = await confirmHarness.getCustomButtons();

      expect(results.length).toEqual(2);
      await expectAsync(results[0].textContent()).toBeResolvedTo('Proceed');
      await expectAsync(results[0].styleType()).toBeResolvedTo('default');
      await expectAsync(results[1].textContent()).toBeResolvedTo('Cancel');
      await expectAsync(results[1].styleType()).toBeResolvedTo('link');
    });

    it('should throw an error when no child button harnesses are found', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            styleType: 'default',
          },
        ],
      });

      await expectAsync(
        confirmHarness.getCustomButtons({ textContent: /invalidbuttonname/ })
      ).toBeRejectedWithError(
        `Could not find buttons matching filter(s): {"textContent":"/invalidbuttonname/"}`
      );
    });

    it('should throw an error when called on confirm of type OK', async () => {
      const { confirmHarness } = await setupTest();

      await expectAsync(
        confirmHarness.getCustomButtons({})
      ).toBeRejectedWithError(
        'Cannot get custom buttons for confirm of type OK'
      );
    });
  });

  describe('clickOkButton', () => {
    it('should throw an error when called on a custom confirm', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            styleType: 'default',
          },
        ],
      });

      await expectAsync(confirmHarness.clickOkButton()).toBeRejectedWithError(
        'Cannot click OK button on a confirm of type custom'
      );
    });

    it('should ouput a closed event when OK button is clicked', async () => {
      const { confirmHarness, fixture } = await setupTest();
      const closedSpy = spyOn(fixture.componentInstance, 'closedChange');
      fixture.detectChanges();

      await confirmHarness.clickOkButton();

      expect(closedSpy).toHaveBeenCalledWith({
        action: 'ok',
      });
    });
  });

  describe('clickCustomButton', () => {
    it('should throw an error when called on an OK confirm', async () => {
      const { confirmHarness } = await setupTest();

      await expectAsync(
        confirmHarness.clickCustomButton({})
      ).toBeRejectedWithError(
        'Cannot get custom buttons for confirm of type OK'
      );
    });

    it('should throw an error if more than one button matches the filters', async () => {
      const { confirmHarness } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            styleType: 'default',
          },
          {
            text: 'Cancel',
            action: 'cancel',
            styleType: 'link',
          },
        ],
      });

      await expectAsync(
        confirmHarness.clickCustomButton({ textContent: /c/ })
      ).toBeRejectedWithError(
        `More than one button matches the filter(s): {"textContent":"/c/"}`
      );
    });

    it('should ouput a closed event when a custom button is clicked', async () => {
      const { confirmHarness, fixture } = await setupTest({
        ...DEFAULT_CONFIRM_CONFIG,
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            styleType: 'default',
          },
        ],
      });
      const closedSpy = spyOn(fixture.componentInstance, 'closedChange');
      fixture.detectChanges();

      await confirmHarness.clickCustomButton({ textContent: 'Proceed' });

      expect(closedSpy).toHaveBeenCalledWith({
        action: 'proceed',
      });
    });
  });
});
