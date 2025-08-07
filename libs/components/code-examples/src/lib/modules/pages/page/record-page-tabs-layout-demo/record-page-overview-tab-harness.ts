import { ComponentHarness } from '@angular/cdk/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

export class RecordPageOverviewTabHarness extends ComponentHarness {
  public static hostSelector = 'app-record-page-overview-tab';

  public async getBoxes(): Promise<SkyBoxHarness[]> {
    return await this.locatorForAll(SkyBoxHarness)();
  }
}
