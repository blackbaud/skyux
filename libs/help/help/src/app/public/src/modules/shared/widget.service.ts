import { Injectable } from '@angular/core';
import { BBHelpClient } from '@blackbaud/help-client';

@Injectable()
export class HelpWidgetService {
  private _pageDefaultKey: string;

  set pageDefaultKey(helpKey: string) {
    this._pageDefaultKey = helpKey;
  }

  get pageDefaultKey(): string {
    return this._pageDefaultKey;
  }

  public setPageDefaultKey(defaultKey: string): void {
    this.pageDefaultKey = defaultKey;
    this.setCurrentHelpKey(this.pageDefaultKey);
  }

  public setCurrentHelpKey(helpKey: string): void {
    BBHelpClient.setCurrentHelpKey(helpKey);
  }

  public setHelpKeyToPageDefault(): void {
    BBHelpClient.setCurrentHelpKey(this.pageDefaultKey);
  }

  public openToHelpKey(helpKey: string): void {
    BBHelpClient.openWidgetToHelpKey(helpKey);
  }

  public setHelpKeyToGlobalDefault(): void {
    BBHelpClient.setHelpKeyToDefault();
    this.pageDefaultKey = '';
  }
}
