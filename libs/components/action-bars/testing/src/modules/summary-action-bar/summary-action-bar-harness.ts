import { HarnessPredicate } from '@angular/cdk/testing';
import { SkySummaryActionBarError } from '@skyux/action-bars';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyChevronHarness,
  SkyStatusIndicatorHarness,
} from '@skyux/indicators/testing';

import { SkySummaryActionBarCancelHarness } from './summary-action-bar-cancel-harness';
import { SkySummaryActionBarCancelHarnessFilters } from './summary-action-bar-cancel-harness-filters';
import { SkySummaryActionBarHarnessFilters } from './summary-action-bar-harness-filters';
import { SkySummaryActionBarPrimaryActionHarness } from './summary-action-bar-primary-action-harness';
import { SkySummaryActionBarPrimaryActionHarnessFilters } from './summary-action-bar-primary-action-harness-filters';
import { SkySummaryActionBarSecondaryActionsHarness } from './summary-action-bar-secondary-actions-harness';
import { SkySummaryActionBarSecondaryActionsHarnessFilters } from './summary-action-bar-secondary-actions-harness-filters';
import { SkySummaryActionBarSummaryHarness } from './summary-action-bar-summary-harness';
import { SkySummaryActionBarSummaryHarnessFilters } from './summary-action-bar-summary-harness-filters';

/**
 * Harness for interacting with a summary action bar component in tests.
 */
export class SkySummaryActionBarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar';

  #chevron = this.locatorForOptional(SkyChevronHarness);
  #errors = this.locatorForAll(
    new HarnessPredicate(SkyStatusIndicatorHarness, {
      ancestor: '.sky-summary-action-bar-errors',
    }),
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarHarness> {
    return SkySummaryActionBarHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * In a smaller viewport, collapses the summary.
   */
  public async collapseSummary(): Promise<void> {
    const chevronHarness = await this.#chevron();

    if (!chevronHarness) {
      throw new Error(
        'Unable to collapse summary. Check if summary action bar is in a modal or a smaller viewport.',
      );
    }

    if (await this.isSummaryVisible()) {
      await chevronHarness.toggle();
    }
  }

  /**
   * In a smaller viewport, expands the summary.
   */
  public async expandSummary(): Promise<void> {
    const chevronHarness = await this.#chevron();

    if (!chevronHarness) {
      throw new Error(
        'Unable to expand summary. Check if summary action bar is in a modal or a smaller viewport.',
      );
    }

    if (!(await this.isSummaryVisible())) {
      await chevronHarness.toggle();
    }
  }

  /**
   * Gets the harness for the cancel action.
   */
  public async getCancel(
    filters?: SkySummaryActionBarCancelHarnessFilters,
  ): Promise<SkySummaryActionBarCancelHarness> {
    return await this.locatorFor(
      SkySummaryActionBarCancelHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the active errors.
   */
  public async getErrors(): Promise<SkySummaryActionBarError[]> {
    const statusIndicatorErrors = await this.#errors();
    const errors: SkySummaryActionBarError[] = [];
    for (const error of statusIndicatorErrors) {
      const message = await error.getText();
      errors.push({ message: message });
    }
    return errors;
  }

  /**
   * Whether the error has fired.
   */
  public async hasError(error: SkySummaryActionBarError): Promise<boolean> {
    const errors = await this.getErrors();
    return errors.some((err) => {
      return err.message === error.message;
    });
  }

  /**
   * Gets the harness for the primary action.
   */
  public async getPrimaryAction(
    filters?: SkySummaryActionBarPrimaryActionHarnessFilters,
  ): Promise<SkySummaryActionBarPrimaryActionHarness> {
    return await this.locatorFor(
      SkySummaryActionBarPrimaryActionHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the harness for the secondary actions.
   */
  public async getSecondaryActions(
    filters?: SkySummaryActionBarSecondaryActionsHarnessFilters,
  ): Promise<SkySummaryActionBarSecondaryActionsHarness> {
    return await this.locatorFor(
      SkySummaryActionBarSecondaryActionsHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the harness for the summary information.
   */
  public async getSummary(
    filters?: SkySummaryActionBarSummaryHarnessFilters,
  ): Promise<SkySummaryActionBarSummaryHarness> {
    const chevronHarness = await this.#chevron();

    // if in mobile, make sure summary is expanded
    if (chevronHarness) {
      await this.expandSummary();
    }

    return await this.locatorFor(
      SkySummaryActionBarSummaryHarness.with(filters || {}),
    )();
  }

  /**
   * Whether the summary information is visible.
   */
  public async isSummaryVisible(): Promise<boolean> {
    const chevronHarness = await this.#chevron();

    if (chevronHarness) {
      if ((await chevronHarness.getDirection()) === 'up') {
        return false;
      }
    }

    return true;
  }
}
