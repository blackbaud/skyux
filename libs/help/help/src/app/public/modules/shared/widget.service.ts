import {
  Injectable
} from '@angular/core';

import {
  BBHelpClient
} from '@blackbaud/help-client';

@Injectable()
export class HelpWidgetService {
  private _pageDefaultKey: string;

  public disabledCount: number = 0;

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

  public toggleOpen(): void {
    BBHelpClient.toggleOpen();
  }

  public openWidget(helpKey?: string): Promise<any> {
    return this.ready()
      .then(() => {
        BBHelpClient.openWidget(helpKey);
      });
  }

  public closeWidget(): Promise<any> {
    return this.ready()
      .then(() => {
        BBHelpClient.closeWidget();
      });
  }

  public disableWidget(): Promise<any> {
    this.disabledCount++;
    return this.ready()
      .then(() => {
        BBHelpClient.disableWidget();
      });
  }

  public enableWidget(): Promise<any> {
    if (this.disabledCount > 0) {
      this.disabledCount--;
    }

    if (this.disabledCount === 0) {
      return this.ready()
        .then(() => {
          BBHelpClient.enableWidget();
        });
    }

    return Promise.resolve();
  }

  public ready(): Promise<any> {
    return BBHelpClient.ready();
  }
}
