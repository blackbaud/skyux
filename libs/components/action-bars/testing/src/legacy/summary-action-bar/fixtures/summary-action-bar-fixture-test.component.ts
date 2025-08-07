import { Component } from '@angular/core';

import { SkySummaryActionBarFixtureAction } from '../summary-action-bar-fixture-action';

@Component({
  selector: 'sky-summary-action-bar-test',
  templateUrl: './summary-action-bar-fixture-test.component.html',
  standalone: false,
})
export class SummaryActionBarTestComponent {
  public static dataSkyId = 'test-summary-action-bar';

  public cancelAction: SkySummaryActionBarFixtureAction = {
    buttonText: 'Cancel action',
    isDisabled: false,
    click: () => this.cancelActionClicked(),
  };

  public primaryAction: SkySummaryActionBarFixtureAction = {
    buttonText: 'Primary action',
    isDisabled: false,
    click: () => this.primaryActionClicked(),
  };

  public secondaryActions: SkySummaryActionBarFixtureAction[] = [
    {
      buttonText: 'Secondary action',
      isDisabled: false,
      click: (): Promise<void> => this.secondaryActionClicked(0),
    },
    {
      buttonText: 'Secondary action 2',
      isDisabled: false,
      click: (): Promise<void> => this.secondaryActionClicked(1),
    },
  ];

  public summaryBody = 'some-content';

  public cancelActionClicked(): Promise<void> {
    return new Promise<void>((resolve) => resolve());
  }

  public primaryActionClicked(): Promise<void> {
    return new Promise<void>((resolve) => resolve());
  }

  // The unused parameter is used by the Jasmine spy in the unit test.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public secondaryActionClicked(index: number): Promise<void> {
    return new Promise<void>((resolve) => resolve());
  }
}
