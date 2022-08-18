import { SkyTokensHarness } from '@skyux/indicators/testing';

import { SkyLookupSelectionHarness } from './lookup-selection-harness';

export class SkyLookupSelectionsListHarness extends SkyTokensHarness {
  public async getSelections(): Promise<SkyLookupSelectionHarness[]> {
    return super.getTokens();
  }

  public async dismissAllSelections(): Promise<void> {
    return super.dismissTokens();
  }

  public async getSelectionsText(): Promise<string[]> {
    return super.getTokenTextValues();
  }
}
