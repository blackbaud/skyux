import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { BBHelpClient } from '@blackbaud/help-client';

import { HelpWidgetService } from './widget.service';

describe('BBHelpClientService', () => {
  let dataService = new HelpWidgetService();

  it('should call the helpClient\'s setCurrentHelpKey and pass the helpKey to it', () => {
    let helpKey = 'test-key.html';
    let spyHelp = spyOn(BBHelpClient, 'setCurrentHelpKey').and.callFake(() => { });
    dataService.setCurrentHelpKey(helpKey);
    expect(spyHelp).toHaveBeenCalledWith(helpKey);
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
    let spyHelp = spyOn(BBHelpClient, 'setCurrentHelpKey').and.callFake(() => { });
    dataService.setPageDefaultKey(pageDefaultKey);
    expect(spyHelp).toHaveBeenCalledWith(pageDefaultKey);
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
    let spyHelp = spyOn(BBHelpClient, 'setCurrentHelpKey').and.callFake(() => { });

    dataService.pageDefaultKey = defaultPageKey;
    dataService.setHelpKeyToPageDefault();

    expect(spyHelp).toHaveBeenCalledWith(defaultPageKey);
  });

  it('should call the helpClient\'s toggleOpen method', () => {
    let spyHelp = spyOn(BBHelpClient, 'toggleOpen').and.callFake(() => { });
    dataService.toggleOpen();

    expect(spyHelp).toHaveBeenCalled();
  });
});
