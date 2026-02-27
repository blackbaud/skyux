import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormConfig,
  SkyInlineFormModule,
} from '@skyux/inline-form';

import { SkyInlineFormHarness } from './inline-form-harness';

@Component({
  imports: [SkyInlineFormModule],
  template: `
    <sky-inline-form
      data-sky-id="inline-form-test"
      [config]="config"
      [showForm]="showForm"
      [template]="inlineFormTest"
      (close)="onClose()"
    >
      <button type="button" class="sky-btn-primary" (click)="onOpen()">
        Open
      </button>
    </sky-inline-form>
    <ng-template #inlineFormTest><div></div></ng-template>
  `,
})
class TestComponent {
  public config: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.DoneCancel,
  };
  public showForm = false;
  public onClose(): void {
    this.showForm = false;
  }
  public onOpen(): void {
    this.showForm = true;
  }
}

describe('Inline form harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    inlineFormHarness: SkyInlineFormHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inlineFormHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyInlineFormHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyInlineFormHarness);

    return {
      inlineFormHarness,
      fixture,
    };
  }

  it('should get the inline form from its data-sky-id', async () => {
    const { inlineFormHarness } = await setupTest({
      dataSkyId: 'inline-form-test',
    });

    await expectAsync(inlineFormHarness.isFormExpanded()).toBeResolved();
  });

  it('should get if the inline form is expanded', async () => {
    const { inlineFormHarness, fixture } = await setupTest();
    await expectAsync(inlineFormHarness.isFormExpanded()).toBeResolvedTo(false);

    fixture.componentInstance.onOpen();
    fixture.detectChanges();

    await expectAsync(inlineFormHarness.isFormExpanded()).toBeResolvedTo(true);
  });

  it('should throw an error when trying to get buttons when the form is not expanded', async () => {
    const { inlineFormHarness } = await setupTest();
    await expectAsync(inlineFormHarness.getButtons()).toBeRejectedWithError(
      'Inline form is not expanded. The buttons cannot be retrieved when not visible.',
    );
  });

  it('should get all the inline form buttons', async () => {
    const { inlineFormHarness, fixture } = await setupTest();

    fixture.componentInstance.onOpen();
    fixture.detectChanges();
    const buttons = await inlineFormHarness.getButtons();

    expect(buttons.length).toBe(2);
  });

  it('should throw an error when trying to get a button when the form is not expanded', async () => {
    const { inlineFormHarness } = await setupTest();
    await expectAsync(inlineFormHarness.getButton({})).toBeRejectedWithError(
      'Inline form is not expanded. The buttons cannot be retrieved when not visible.',
    );
  });

  it('should get a button that matches the given filters', async () => {
    const { inlineFormHarness, fixture } = await setupTest();

    fixture.componentInstance.onOpen();
    fixture.detectChanges();
    const button = await inlineFormHarness.getButton({
      text: 'Cancel',
    });

    await expectAsync(button?.getStyleType()).toBeResolvedTo('link');
  });

  it('should get buttons that matches the given filters', async () => {
    const { inlineFormHarness, fixture } = await setupTest();

    fixture.componentInstance.config = {
      buttonLayout: SkyInlineFormButtonLayout.Custom,
      buttons: [
        {
          text: 'Cancel',
          styleType: 'link',
          action: 'cancel',
        },
        {
          text: 'Cancel',
          styleType: 'link',
          action: 'cancel',
        }],
    };
    fixture.detectChanges();
    fixture.componentInstance.onOpen();
    fixture.detectChanges();

    const buttons = await inlineFormHarness.getButtons({
      text: 'Cancel',
    });

    expect(buttons.length).toBe(2);
  });

  it('should get the inline form template', async () => {
    const { inlineFormHarness, fixture } = await setupTest();

    fixture.componentInstance.onOpen();
    fixture.detectChanges();

    await expectAsync(inlineFormHarness.getTemplate()).toBeResolved();
  });

  it('should throw an error when trying to get the template when the form is not expanded', async () => {
    const { inlineFormHarness } = await setupTest();
    await expectAsync(inlineFormHarness.getTemplate()).toBeRejectedWithError(
      'Inline form is not expanded. Cannot retrieve template when not visible.',
    );
  });

  describe('button harness', () => {
    it('should filter the buttons by text', async () => {
      const { inlineFormHarness, fixture } = await setupTest();

      fixture.componentInstance.onOpen();
      fixture.detectChanges();

      const button = await inlineFormHarness.getButton({
        text: 'Cancel',
      });

      expect(await button?.getText()).toBe('Cancel');
    });

    it('should filter the buttons by style type', async () => {
      const { inlineFormHarness, fixture } = await setupTest();

      fixture.componentInstance.onOpen();
      fixture.detectChanges();

      const button = await inlineFormHarness.getButton({
        styleType: 'link',
      });

      expect(await button?.getText()).toBe('Cancel');
    });

    it('should click the button', async () => {
      const { inlineFormHarness, fixture } = await setupTest();

      fixture.componentInstance.onOpen();
      fixture.detectChanges();

      await expectAsync(inlineFormHarness.isFormExpanded()).toBeResolvedTo(
        true,
      );

      const button = await inlineFormHarness.getButton({
        text: 'Cancel',
      });

      await button?.click();

      await expectAsync(inlineFormHarness.isFormExpanded()).toBeResolvedTo(
        false,
      );
    });

    it('should get the button style type', async () => {
      const { inlineFormHarness, fixture } = await setupTest();

      fixture.componentInstance.config = {
        buttonLayout: SkyInlineFormButtonLayout.Custom,
        buttons: [
          {
            text: 'Save',
            styleType: 'primary',
            action: 'save',
          },
          {
            text: 'Cancel',
            styleType: 'link',
            action: 'cancel',
          },
          {
            text: 'Delete',
            styleType: 'default',
            action: 'delete',
          }],
      };
      fixture.detectChanges();
      fixture.componentInstance.onOpen();
      fixture.detectChanges();

      const buttons = await inlineFormHarness.getButtons();

      await expectAsync(buttons[0].getStyleType()).toBeResolvedTo('primary');
      await expectAsync(buttons[1].getStyleType()).toBeResolvedTo('link');
      await expectAsync(buttons[2].getStyleType()).toBeResolvedTo('default');
    });

    it('should get whether the button is disabled', async () => {
      const { inlineFormHarness, fixture } = await setupTest();

      fixture.componentInstance.config = {
        buttonLayout: SkyInlineFormButtonLayout.Custom,
        buttons: [
          {
            text: 'Save',
            styleType: 'primary',
            action: 'save',
            disabled: true,
          },
          {
            text: 'Cancel',
            styleType: 'link',
            action: 'cancel',
          }],
      };
      fixture.detectChanges();
      fixture.componentInstance.onOpen();
      fixture.detectChanges();

      const buttons = await inlineFormHarness.getButtons();

      await expectAsync(buttons[0].isDisabled()).toBeResolvedTo(true);
      await expectAsync(buttons[1].isDisabled()).toBeResolvedTo(false);
    });
  });
});
