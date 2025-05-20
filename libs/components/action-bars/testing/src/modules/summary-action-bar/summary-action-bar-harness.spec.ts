import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkySummaryActionBarError,
  SkySummaryActionBarModule,
} from '@skyux/action-bars';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { SkySummaryActionBarHarness } from './summary-action-bar-harness';

@Component({
  standalone: true,
  imports: [SkySummaryActionBarModule, SkyKeyInfoModule],
  template: `
    <sky-summary-action-bar [formErrors]="errors" data-sky-id="action-bar">
      <sky-summary-action-bar-actions>
        <sky-summary-action-bar-primary-action
          data-sky-id="primary-action"
          [disabled]="disabled"
          (actionClick)="save()"
        >
          Primary action
        </sky-summary-action-bar-primary-action>
        <sky-summary-action-bar-secondary-actions
          data-sky-id="secondary-actions"
        >
          <sky-summary-action-bar-secondary-action
            (actionClick)="onSecondaryActionClick()"
          >
            Secondary action
          </sky-summary-action-bar-secondary-action>
          <sky-summary-action-bar-secondary-action
            data-sky-id="secondary-action-2"
            [disabled]="disabled"
            (actionClick)="onSecondaryAction2Click()"
          >
            Secondary action 2
          </sky-summary-action-bar-secondary-action>
        </sky-summary-action-bar-secondary-actions>
        <sky-summary-action-bar-cancel
          data-sky-id="cancel"
          [disabled]="disabled"
          (actionClick)="cancel()"
        >
          Cancel
        </sky-summary-action-bar-cancel>
      </sky-summary-action-bar-actions>
      <sky-summary-action-bar-summary data-sky-id="summary">
        <sky-key-info>
          <sky-key-info-value>$250</sky-key-info-value>
          <sky-key-info-label>Given this month</sky-key-info-label>
        </sky-key-info>
        <sky-key-info>
          <sky-key-info-value>$1,000</sky-key-info-value>
          <sky-key-info-label>Given this year</sky-key-info-label>
        </sky-key-info>
        <sky-key-info>
          <sky-key-info-value>$1,300</sky-key-info-value>
          <sky-key-info-label>Given all time</sky-key-info-label>
        </sky-key-info>
      </sky-summary-action-bar-summary>
    </sky-summary-action-bar>
  `,
})
class TestComponent {
  public disabled = false;
  public save(): void {}
  public onSecondaryActionClick(): void {}
  public onSecondaryAction2Click(): void {}
  public cancel(): void {}
  public errors: SkySummaryActionBarError[] | undefined;
}

describe('Summary action harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    summaryActionHarness: SkySummaryActionBarHarness;
    fixture: ComponentFixture<TestComponent>;
    mediaQuery: SkyMediaQueryTestingController;
  }> {
    TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
      providers: [provideSkyMediaQueryTesting()],
    });
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const summaryActionHarness = options.dataSkyId
      ? await loader.getHarness(
          SkySummaryActionBarHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkySummaryActionBarHarness);

    const mediaQuery = TestBed.inject(SkyMediaQueryTestingController);

    return { summaryActionHarness, fixture, mediaQuery };
  }

  it('should get the summary action bar from data-sky-id`', async () => {
    const { summaryActionHarness } = await setupTest({
      dataSkyId: 'action-bar',
    });

    await expectAsync(summaryActionHarness.getPrimaryAction()).toBeResolved();
  });

  it('should get the summary action bar primary action from its data-sky-id', async () => {
    const { summaryActionHarness } = await setupTest();

    await expectAsync(
      summaryActionHarness.getPrimaryAction({ dataSkyId: 'primary-action' }),
    ).toBeResolved();
  });

  it('should get the summary action bar secondary actions', async () => {
    const { summaryActionHarness } = await setupTest();

    await expectAsync(
      summaryActionHarness.getSecondaryActions(),
    ).toBeResolved();
    await expectAsync(
      summaryActionHarness.getSecondaryActions({
        dataSkyId: 'secondary-actions',
      }),
    ).toBeResolved();
  });

  it('should get the cancel button', async () => {
    const { summaryActionHarness } = await setupTest();

    await expectAsync(summaryActionHarness.getCancel()).toBeResolved();
    await expectAsync(
      summaryActionHarness.getCancel({
        dataSkyId: 'cancel',
      }),
    ).toBeResolved();
  });

  it('should get all the error messages', async () => {
    const { summaryActionHarness, fixture } = await setupTest();

    fixture.componentInstance.errors = [
      {
        message: 'Test error',
      },
      {
        message: 'Test error 2',
      },
    ];
    fixture.detectChanges();

    await expectAsync(summaryActionHarness.getErrors()).toBeResolvedTo(
      fixture.componentInstance.errors,
    );
  });

  it('should get whether an error has fired', async () => {
    const { summaryActionHarness, fixture } = await setupTest();

    fixture.componentInstance.errors = [
      {
        message: 'Test error',
      },
      {
        message: 'Test error 2',
      },
    ];
    fixture.detectChanges();
    await expectAsync(
      summaryActionHarness.hasError({ message: 'Test error' }),
    ).toBeResolvedTo(true);
  });

  describe('cancel button', () => {
    it('should click the cancel button', async () => {
      const { summaryActionHarness, fixture } = await setupTest();
      const cancelHarness = await summaryActionHarness.getCancel();
      const spy = spyOn(fixture.componentInstance, 'cancel');
      await cancelHarness.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should get text', async () => {
      const { summaryActionHarness } = await setupTest();
      const cancelHarness = await summaryActionHarness.getCancel();
      await expectAsync(cancelHarness.getText()).toBeResolvedTo('Cancel');
    });

    it("should get whether it's disabled", async () => {
      const { summaryActionHarness, fixture } = await setupTest();
      const cancelHarness = await summaryActionHarness.getCancel();
      await expectAsync(cancelHarness.isDisabled()).toBeResolvedTo(false);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();
      await expectAsync(cancelHarness.isDisabled()).toBeResolvedTo(true);
    });
  });

  describe('primary button', () => {
    it('should click the primary button', async () => {
      const { summaryActionHarness, fixture } = await setupTest();
      const primaryHarness = await summaryActionHarness.getPrimaryAction();
      const spy = spyOn(fixture.componentInstance, 'save');
      await primaryHarness.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should get text', async () => {
      const { summaryActionHarness } = await setupTest();
      const primaryHarness = await summaryActionHarness.getPrimaryAction();
      await expectAsync(primaryHarness.getText()).toBeResolvedTo(
        'Primary action',
      );
    });

    it("should get whether it's disabled", async () => {
      const { summaryActionHarness, fixture } = await setupTest();
      const primaryHarness = await summaryActionHarness.getPrimaryAction();
      await expectAsync(primaryHarness.isDisabled()).toBeResolvedTo(false);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();
      await expectAsync(primaryHarness.isDisabled()).toBeResolvedTo(true);
    });
  });

  describe('secondary actions', () => {
    it('should get the actions', async () => {
      const { summaryActionHarness } = await setupTest();
      const actionsHarness = await summaryActionHarness.getSecondaryActions();
      const actions = await actionsHarness.getActions();
      expect(actions.length).toBe(2);
    });

    it("should get an action from it's data-sky-id", async () => {
      const { summaryActionHarness } = await setupTest();
      const actionsHarness = await summaryActionHarness.getSecondaryActions();
      await expectAsync(
        actionsHarness.getAction({ dataSkyId: 'secondary-action-2' }),
      ).toBeResolved();
    });
  });

  describe('secondary action', () => {
    it('should click the action', async () => {
      const { summaryActionHarness, fixture } = await setupTest();
      const actionsHarness = await summaryActionHarness.getSecondaryActions();
      const action = await actionsHarness.getAction({
        dataSkyId: 'secondary-action-2',
      });
      const spy = spyOn(fixture.componentInstance, 'onSecondaryAction2Click');
      await action.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should get the text', async () => {
      const { summaryActionHarness } = await setupTest();
      const actionsHarness = await summaryActionHarness.getSecondaryActions();
      const action = await actionsHarness.getAction({
        dataSkyId: 'secondary-action-2',
      });

      await expectAsync(action.getText()).toBeResolvedTo('Secondary action 2');
    });

    it("should get whether it's disabled", async () => {
      const { summaryActionHarness, fixture } = await setupTest();
      const actionsHarness = await summaryActionHarness.getSecondaryActions();
      const action = await actionsHarness.getAction({
        dataSkyId: 'secondary-action-2',
      });
      await expectAsync(action.isDisabled()).toBeResolvedTo(false);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      await expectAsync(action.isDisabled()).toBeResolvedTo(true);
    });
  });

  describe('mobile view', () => {
    async function mobileView(
      fixture: ComponentFixture<TestComponent>,
      mediaQuery: SkyMediaQueryTestingController,
    ): Promise<void> {
      mediaQuery.setBreakpoint('xs');
      fixture.detectChanges();
      await fixture.whenStable();
    }

    it('should throw an error if attempting to expand or collapse summary when not in smaller viewport', async () => {
      const { summaryActionHarness } = await setupTest();

      await expectAsync(
        summaryActionHarness.collapseSummary(),
      ).toBeRejectedWithError(
        'Unable to collapse summary. Check if summary action bar is in a modal or a smaller viewport.',
      );

      await expectAsync(
        summaryActionHarness.expandSummary(),
      ).toBeRejectedWithError(
        'Unable to expand summary. Check if summary action bar is in a modal or a smaller viewport.',
      );
    });

    it('should get whether summary action bar summary is visible', async () => {
      const { summaryActionHarness, fixture, mediaQuery } = await setupTest();
      await mobileView(fixture, mediaQuery);

      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        true,
      );

      await summaryActionHarness.collapseSummary();
      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        false,
      );
      await summaryActionHarness.collapseSummary();
      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        false,
      );

      await summaryActionHarness.expandSummary();
      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        true,
      );
      await summaryActionHarness.expandSummary();
      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        true,
      );
    });

    it('should get the summary action bar summary harness in mobile', async () => {
      const { summaryActionHarness, fixture, mediaQuery } = await setupTest();
      await mobileView(fixture, mediaQuery);

      await summaryActionHarness.collapseSummary();
      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        false,
      );
      await expectAsync(summaryActionHarness.getSummary()).toBeResolved();
      await expectAsync(summaryActionHarness.isSummaryVisible()).toBeResolvedTo(
        true,
      );
    });

    describe('secondary actions', () => {
      it('should get actions', async () => {
        const { summaryActionHarness, fixture, mediaQuery } = await setupTest();
        await mobileView(fixture, mediaQuery);

        const actionsHarness = await summaryActionHarness.getSecondaryActions();
        const actions = await actionsHarness.getActions();
        expect(actions.length).toBe(2);
      });

      it('should get actions from filters', async () => {
        const { summaryActionHarness, fixture, mediaQuery } = await setupTest();
        await mobileView(fixture, mediaQuery);

        const actionsHarness = await summaryActionHarness.getSecondaryActions();
        const actions = await actionsHarness.getActions({
          dataSkyId: 'secondary-action-2',
        });
        expect(actions.length).toBe(1);
      });

      it('should throw an error if no actions found with filter', async () => {
        const { summaryActionHarness, fixture, mediaQuery } = await setupTest();
        await mobileView(fixture, mediaQuery);
        const actionsHarness = await summaryActionHarness.getSecondaryActions();
        await expectAsync(
          actionsHarness.getActions({
            dataSkyId: 'secondary-actions',
          }),
        ).toBeRejectedWithError(
          'Unable to find summary action secondary action(s) with filter(s): {"dataSkyId":"secondary-actions"}.',
        );
      });

      it("should get an action from it's data-sky-id", async () => {
        const { summaryActionHarness, fixture, mediaQuery } = await setupTest();
        await mobileView(fixture, mediaQuery);

        const actionsHarness = await summaryActionHarness.getSecondaryActions();
        await expectAsync(
          actionsHarness.getAction({ dataSkyId: 'secondary-action-2' }),
        ).toBeResolved();
      });
    });
  });
});
