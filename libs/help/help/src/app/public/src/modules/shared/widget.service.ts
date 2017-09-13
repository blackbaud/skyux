import { Injectable } from '@angular/core';
import { BBHelpClient } from '@blackbaud/help-client';

@Injectable()
export class HelpWidgetService {

  public setCurrentHelpKey(helpKey: string): void {
    BBHelpClient.setCurrentHelpKey(helpKey);
  }

  public openToHelpKey(helpKey: string): void {
    BBHelpClient.openWidgetToHelpKey(helpKey);
  }

  public setHelpKeyToDefault(): void {
    BBHelpClient.setHelpKeyToDefault();
  }
}
