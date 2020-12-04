import {
  Component
} from '@angular/core';

import {
  SkySummaryActionBarFixtureAction
} from '../summary-action-bar-fixture-action';

@Component({
  selector: 'summary-action-bar',
  templateUrl: './summary-action-bar-fixture-test.component.html'
})
export class SummaryActionBarTestComponent {
  public static dataSkyId: string = 'test-summary-action-bar';

  public cancelAction: SkySummaryActionBarFixtureAction = {
    buttonText: 'Cancel action',
    isDisabled: false,
    click: () => this.cancelActionClicked()
  };

  public primaryAction: SkySummaryActionBarFixtureAction = {
    buttonText: 'Primary action',
    isDisabled: false,
    click: () => this.primaryActionClicked()
  };

  public secondaryActions: SkySummaryActionBarFixtureAction[] = [
    {
      buttonText: 'Secondary action',
      isDisabled: false,
      click: () => this.secondaryActionClicked(0)
    },
    {
      buttonText: 'Secondary action 2',
      isDisabled: false,
      click: () => this.secondaryActionClicked(1)
    }
  ];

  public summaryBody: string = 'some-content';

  public cancelActionClicked(): Promise<void> {
    return new Promise<void>(resolve => resolve() );
  }

  public primaryActionClicked(): Promise<void> {
    return new Promise<void>(resolve => resolve() );
  }

  public secondaryActionClicked(index: number): Promise<void> {
    return new Promise<void>(resolve => resolve() );
  }
}
