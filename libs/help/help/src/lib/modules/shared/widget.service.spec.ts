import {
  BBHelpClient
} from '@blackbaud/help-client';

import {
  HelpWidgetService
} from './widget.service';

import {
  fakeAsync,
  tick
} from '@angular/core/testing';

describe('BBHelpClientService', () => {
  let dataService = new HelpWidgetService();
  let resolvePromise = true;
  let setHelpKeySpy: jasmine.Spy;

  beforeEach(() => {
    resolvePromise = true;
    setHelpKeySpy = spyOn(BBHelpClient, 'setCurrentHelpKey').and.callFake((key: string) => { });
    spyOn(BBHelpClient, 'ready').and.callFake(() => {
      if (resolvePromise) {
        return Promise.resolve();
      } else {
        return Promise.reject('reason');
      }
    });
  });

  it('should call the helpClient\'s setCurrentHelpKey and pass the helpKey to it', () => {
    let helpKey = 'test-key.html';
    dataService.setCurrentHelpKey(helpKey);
    expect(setHelpKeySpy).toHaveBeenCalledWith(helpKey);
  });

  it('should call the helpClient\'s openToHelpKey and pass the helpKey to it', () => {
    let helpKey = 'test-key.html';
    let spyHelp = spyOn(BBHelpClient, 'openWidgetToHelpKey').and.callFake(() => { });
    dataService.openToHelpKey(helpKey);
    expect(spyHelp).toHaveBeenCalledWith(helpKey);
  });

  it('should call the helpClient\'s setHelpKeyToDefault method', () => {
    let spyHelp = spyOn(BBHelpClient, 'setHelpKeyToDefault').and.callFake(() => { });
    dataService.setHelpKeyToGlobalDefault();
    expect(spyHelp).toHaveBeenCalled();
  });

  it('should store a pageDefaultKey', () => {
    let pageDefaultKey = 'page-default-key.html';
    expect(dataService.pageDefaultKey).toBe('');
    dataService.setPageDefaultKey(pageDefaultKey);
    expect(dataService.pageDefaultKey).toBe(pageDefaultKey);
  });

  it('should call the helpClient\'s setCurrentHelpKey with the pageDefaultKey when it is defined', () => {
    let pageDefaultKey = 'page-default-key.html';
    dataService.setPageDefaultKey(pageDefaultKey);
    expect(setHelpKeySpy).toHaveBeenCalledWith(pageDefaultKey);
  });

  it('should remove the pageDefaultKey and call the helpClient\'s setHelpKeyToDefault method', () => {
    let defaultPageKey = 'default-page-key.html';
    let spyHelp = spyOn(BBHelpClient, 'setHelpKeyToDefault').and.callFake(() => { });
    dataService.setPageDefaultKey(defaultPageKey);

    expect(dataService.pageDefaultKey).toEqual(defaultPageKey);
    dataService.setHelpKeyToGlobalDefault();
    expect(dataService.pageDefaultKey).toEqual('');
    expect(spyHelp).toHaveBeenCalled();
  });

  it('should call the helpClient\'s setCurrentHelpKey with the pageDefaultKey', () => {
    let defaultPageKey = 'default-page-key.html';

    dataService.pageDefaultKey = defaultPageKey;
    dataService.setHelpKeyToPageDefault();

    expect(setHelpKeySpy).toHaveBeenCalledWith(defaultPageKey);
  });

  it('should see if the client is ready before calling async methods', fakeAsync(() => {
    let spyHelp = spyOn(BBHelpClient, 'openWidget').and.callFake(() => { });
    dataService.openWidget()
      .then(() => {
        expect(spyHelp).toHaveBeenCalled();
      });
  }));

  it('should not call any async methods if ready check fails', () => {
    let spyHelp = spyOn(BBHelpClient, 'openWidget').and.callFake(() => { });
    resolvePromise = false;

    dataService.openWidget()
      .then(() => { })
      .catch((error: string) => {
        expect(spyHelp).not.toHaveBeenCalled();
        expect(error).toEqual('reason');
      });
  });

  it('should call the helpClient\'s openWidget method', () => {
    let spyHelp = spyOn(BBHelpClient, 'openWidget').and.callFake(() => { });
    resolvePromise = true;

    dataService.openWidget()
      .then(() => {
        expect(spyHelp).toHaveBeenCalled();
        expect(spyHelp).toHaveBeenCalledWith(undefined);
      });
  });

  it('should call the helpClient\'s openWidget method with a helpKey', () => {
    let spyHelp = spyOn(BBHelpClient, 'openWidget').and.callFake(() => { });
    resolvePromise = true;
    let testKey = 'foo.html';

    dataService.openWidget(testKey)
      .then(() => {
        expect(spyHelp).toHaveBeenCalledWith(testKey);
      });
  });

  it('should call the helpClient\'s closeWidget method', () => {
    let spyHelp = spyOn(BBHelpClient, 'closeWidget').and.callFake(() => { });

    dataService.closeWidget()
      .then(() => {
        expect(spyHelp).toHaveBeenCalled();
      });
  });

  it('should call the helpClient\'s toggleOpen method', () => {
    let spyHelp = spyOn(BBHelpClient, 'toggleOpen').and.callFake(() => { });
    dataService.toggleOpen();
    expect(spyHelp).toHaveBeenCalled();
  });

  it('should increase the disableCount each time disableWidget is called', fakeAsync(() => {
    let spyHelp = spyOn(BBHelpClient, 'disableWidget').and.callFake(() => { });
    expect(dataService.disabledCount).toEqual(0);
    dataService.disableWidget();
    tick(1000);
    expect(dataService.disabledCount).toEqual(1);
    dataService.disableWidget();
    tick(1000);
    dataService.disableWidget();
    tick(1000);
    expect(dataService.disabledCount).toEqual(3);
    expect(spyHelp).toHaveBeenCalledTimes(3);
  }));

  it('should enable the HelpWidget when the disabledCount decreases below 1', fakeAsync(() => {
    let spyHelpEnable = spyOn(BBHelpClient, 'enableWidget').and.callFake(() => { });

    // Reset the disabled count from previous tests.
    dataService.disabledCount = 3;

    expect(dataService.disabledCount).toEqual(3);
    expect(spyHelpEnable).not.toHaveBeenCalled();
    dataService.enableWidget();
    tick(1000);
    expect(dataService.disabledCount).toEqual(2);
    expect(spyHelpEnable).not.toHaveBeenCalled();
    dataService.enableWidget();
    tick(1000);
    expect(dataService.disabledCount).toEqual(1);
    expect(spyHelpEnable).not.toHaveBeenCalled();
    dataService.enableWidget();
    tick(1000);
    expect(dataService.disabledCount).toEqual(0);
    expect(spyHelpEnable).toHaveBeenCalled();
  }));

  it('should not allow disabledCount to decrease below 0', fakeAsync(() => {
    let spyHelpEnable = spyOn(BBHelpClient, 'enableWidget').and.callFake(() => { });

    // Reset the disabled count from previous tests.
    dataService.disabledCount = 0;

    dataService.enableWidget();
    dataService.enableWidget();
    dataService.enableWidget();
    tick(1000);
    expect(dataService.disabledCount).toEqual(0);
    expect(spyHelpEnable).toHaveBeenCalled();
  }));

  it('should provide a ready check for async methods', fakeAsync(() => {
    dataService.ready()
      .then(() => {
        expect(BBHelpClient.ready).toHaveBeenCalled();
      });
  }));
});
