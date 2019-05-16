import {
  ApplicationRef
} from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  inject,
  tick,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyFlyoutConfig
} from './types';

import {
  SkyFlyoutFixturesModule
} from './fixtures/flyout-fixtures.module';

import {
  SkyFlyoutInstance
} from './flyout-instance';

import {
  SkyFlyoutService
} from './flyout.service';

import {
  SkyFlyoutTestComponent
} from './fixtures/flyout.component.fixture';

import {
  SkyFlyoutTestSampleContext
} from './fixtures/flyout-sample-context.fixture';

import {
  SkyFlyoutComponent
} from './flyout.component';

import {
  SkyFlyoutMediaQueryService
} from './flyout-media-query.service';

describe('Flyout component', () => {
  let applicationRef: ApplicationRef;
  let fixture: ComponentFixture<SkyFlyoutTestComponent>;
  let flyoutService: SkyFlyoutService;

  function openFlyout(config: SkyFlyoutConfig = {}, showIframe?: boolean): SkyFlyoutInstance<any> {
    config = Object.assign({
      providers: [{
        provide: SkyFlyoutTestSampleContext,
        useValue: { name: 'Sam', showIframe: showIframe }
      }]
    }, config);

    const flyoutInstance = fixture.componentInstance.openFlyout(config);

    applicationRef.tick();
    tick();
    fixture.detectChanges();

    return flyoutInstance;
  }

  function openHostFlyout(): SkyFlyoutInstance<any> {
    const flyoutInstance = fixture.componentInstance.openHostsFlyout();

    applicationRef.tick();
    tick();
    fixture.detectChanges();

    return flyoutInstance;
  }

  function closeFlyout(): void {
    const closeButton = getCloseButtonElement();
    closeButton.click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function makeEvent(eventType: string, evtObj: any): void {
    let evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(eventType, false, false, window, 0, 0, 0, evtObj.clientX,
      0, false, false, false, false, 0, undefined);
    document.dispatchEvent(evt);
  }

  function grabDragHandle(handleXCord: number): void {
    const handleElement = getFlyoutHandleElement();
    let evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('mousedown', false, false, window, 0, 0, 0, handleXCord,
      0, false, false, false, false, 0, undefined);

    handleElement.dispatchEvent(evt);
  }

  function dragHandle(endingXCord: number): void {
    makeEvent('mousemove', { clientX: endingXCord });
    fixture.detectChanges();
    tick();
  }

  function releaseDragHandle(): void {
    makeEvent('mouseup', {});
  }

  function resizeFlyout(startingXCord: number, endingXCord: number): void {
    grabDragHandle(startingXCord);
    dragHandle(endingXCord);
    releaseDragHandle();
  }

  function getFlyoutElement(): HTMLElement {
    return document.querySelector('.sky-flyout') as HTMLElement;
  }

  function getFlyoutHostElement(): HTMLElement {
    return document.querySelector('sky-flyout') as HTMLElement;
  }

  function getFlyoutHandleElement(): HTMLElement {
    return document.querySelector('.sky-flyout-resize-handle') as HTMLElement;
  }

  function getFlyoutHeaderElement(): HTMLElement {
    return document.querySelector('.sky-flyout-header') as HTMLElement;
  }

  function getCloseButtonElement(): HTMLElement {
    return document.querySelector('.sky-flyout-btn-close') as HTMLElement;
  }

  function getPermalinkButtonElement(): HTMLElement {
    return document.querySelector('.sky-flyout-btn-permalink') as HTMLElement;
  }

  function getPrimaryActionButtonElement(): HTMLElement {
    return document.querySelector('.sky-flyout-btn-primary-action') as HTMLElement;
  }

  function getFlyoutModalTriggerElement(): HTMLElement {
    return document.querySelector('#modal-trigger') as HTMLElement;
  }

  function getModalElement(): HTMLElement {
    return document.querySelector('.sky-modal-content') as HTMLElement;
  }

  function getFlyoutToastTriggerElement(): HTMLElement {
    return document.querySelector('#toast-trigger') as HTMLElement;
  }

  function getToastElement(): HTMLElement {
    return document.querySelector('.sky-toast-content') as HTMLElement;
  }

  function getIframe(): HTMLElement {
    return document.querySelector('iframe') as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyFlyoutFixturesModule
      ]
    });

    fixture = TestBed.createComponent(SkyFlyoutTestComponent);
    fixture.detectChanges();
  });

  beforeEach(inject([ApplicationRef, SkyFlyoutService],
    (
      _applicationRef: ApplicationRef,
      _flyoutService: SkyFlyoutService
    ) => {
      applicationRef = _applicationRef;
      flyoutService = _flyoutService;
      flyoutService.close();
    }
  ));

  afterEach(fakeAsync(() => {
    flyoutService.close();
    applicationRef.tick();
    tick();
    fixture.detectChanges();
    flyoutService.ngOnDestroy();
    applicationRef.tick();
    fixture.destroy();
  }));

  it('should close when the close button is clicked', fakeAsync(() => {
    const flyout = openFlyout();
    expect(flyout.isOpen).toBe(true);

    closeFlyout();
    expect(flyout.isOpen).toBe(false);
  }));

  it('should close when the click event fires outside of the flyout', fakeAsync(() => {
    const flyout = openFlyout();
    expect(flyout.isOpen).toBe(true);

    fixture.nativeElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(false);
  }));

  it('should NOT close when the click event fires inside the flyout', fakeAsync(() => {
    const flyout = openFlyout();
    expect(flyout.isOpen).toBe(true);

    const flyoutContentElement = getFlyoutElement();
    flyoutContentElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);
  }));

  it('should NOT close when the click event fires on a modal element', fakeAsync(() => {
    const flyout = openHostFlyout();
    expect(flyout.isOpen).toBe(true);

    const flyoutModalTriggerElement = getFlyoutModalTriggerElement();
    flyoutModalTriggerElement.click();
    fixture.detectChanges();
    tick();

    const modalContentElement = getModalElement();
    modalContentElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);
  }));

  it('should NOT close when the click event fires on a toast element', fakeAsync(() => {
    const flyout = openHostFlyout();
    expect(flyout.isOpen).toBe(true);

    const flyoutToastTriggerElement = getFlyoutToastTriggerElement();
    flyoutToastTriggerElement.click();
    fixture.detectChanges();
    tick();

    const toastContentElement = getToastElement();
    toastContentElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);
  }));

  it('should close when the Close message type is received', fakeAsync(() => {
    const flyout = openFlyout();
    expect(flyout.isOpen).toBe(true);

    flyout.close();
    tick();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(false);
  }));

  it('should emit closed event of previously opened flyouts when a new one is opened',
    fakeAsync(() => {
      const flyout = openFlyout();

      let closedCalled = false;
      flyout.closed.subscribe(() => {
        closedCalled = true;
      });

      // Open a new flyout before closing the last one:
      openFlyout();

      expect(closedCalled).toEqual(true);
    })
  );

  it('should pass providers to the flyout', fakeAsync(() => {
    openFlyout({
      providers: [{
        provide: SkyFlyoutTestSampleContext,
        useValue: {
          name: 'Sally'
        }
      }]
    });

    const flyoutContentElement = getFlyoutElement()
      .querySelector('.sky-flyout-content') as HTMLElement;

    expect(flyoutContentElement).toHaveText('Sally');
  }));

  it('should accept configuration options for aria-labelledBy, aria-describedby, role, and width',
    fakeAsync(() => {
      const expectedLabel = 'customlabelledby';
      const expectedDescribed = 'customdescribedby';
      const expectedRole = 'customrole';
      const expectedDefault = 500;

      openFlyout({
        ariaLabelledBy: expectedLabel,
        ariaDescribedBy: expectedDescribed,
        ariaRole: expectedRole,
        defaultWidth: expectedDefault
      });

      const flyoutElement = getFlyoutElement();

      expect(flyoutElement.getAttribute('aria-labelledby'))
        .toBe(expectedLabel);
      expect(flyoutElement.getAttribute('aria-describedby'))
        .toBe(expectedDescribed);
      expect(flyoutElement.getAttribute('role'))
        .toBe(expectedRole);
      expect(flyoutElement.style.width)
        .toBe(expectedDefault + 'px');
    })
  );

  it('should not have the sky-flyout-help-shim class if the help widget is not present',
    fakeAsync(() => {
      openFlyout();
      const headerElement = getFlyoutHeaderElement();
      expect(headerElement.classList.contains('sky-flyout-help-shim')).toBeFalsy();
    })
  );

  it('should have the sky-flyout-help-shim class if the help widget is present',
    fakeAsync(() => {
      spyOn(window.document, 'getElementById').and.returnValue({});
      openFlyout();
      const headerElement = getFlyoutHeaderElement();
      expect(headerElement.classList.contains('sky-flyout-help-shim')).toBeTruthy();
    })
  );

  it('should resize when handle is dragged', fakeAsync(() => {
    openFlyout({});
    fixture.detectChanges();
    tick();
    const moveSpy = spyOn(SkyFlyoutComponent.prototype, 'onMouseMove').and.callThrough();
    const mouseUpSpy = spyOn(SkyFlyoutComponent.prototype, 'onHandleRelease').and.callThrough();
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    resizeFlyout(1000, 1100);

    expect(flyoutElement.style.width).toBe('400px');

    resizeFlyout(1100, 1000);

    expect(moveSpy).toHaveBeenCalled();
    expect(mouseUpSpy).toHaveBeenCalled();
  }));

  it('should not resize when handle is dragged at xs screen size', fakeAsync(() => {
    openFlyout({});
    fixture.detectChanges();
    tick();
    const moveSpy = spyOn(SkyFlyoutComponent.prototype, 'onMouseMove').and.callThrough();
    const mouseUpSpy = spyOn(SkyFlyoutComponent.prototype, 'onHandleRelease').and.callThrough();
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    resizeFlyout(1000, 1100);

    expect(flyoutElement.style.width).toBe('400px');

    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(767);

    resizeFlyout(1100, 1000);

    expect(moveSpy).toHaveBeenCalledTimes(1);
    expect(mouseUpSpy).toHaveBeenCalledTimes(1);
  }));

  it('should not resize on mousemove unless the resize handle was clicked', fakeAsync(() => {
    openFlyout({});
    fixture.detectChanges();
    tick();
    const moveSpy = spyOn(SkyFlyoutComponent.prototype, 'onMouseMove').and.callThrough();
    const mouseUpSpy = spyOn(SkyFlyoutComponent.prototype, 'onHandleRelease').and.callThrough();
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    dragHandle(1100);

    expect(flyoutElement.style.width).toBe('500px');

    dragHandle(1000);

    expect(flyoutElement.style.width).toBe('500px');

    releaseDragHandle();

    expect(moveSpy).not.toHaveBeenCalled();
    expect(mouseUpSpy).not.toHaveBeenCalled();
  }));

  it('should resize flyout when range input is changed', fakeAsync(() => {
    openFlyout({});
    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('500px');
    let resizeInput: any = flyoutElement.querySelector('.sky-flyout-resize-handle');

    resizeInput.value = '400';
    SkyAppTestUtility.fireDomEvent(resizeInput, 'input');
    fixture.detectChanges();
    tick();
    expect(flyoutElement.style.width).toBe('400px');

    resizeInput.value = '500';
    SkyAppTestUtility.fireDomEvent(resizeInput, 'input');
    fixture.detectChanges();
    tick();
    expect(flyoutElement.style.width).toBe('500px');
  }));

  it('should have correct aria-labels on resizing range input', fakeAsync(() => {
    openFlyout({ maxWidth: 1000, minWidth: 200 });
    const flyoutElement = getFlyoutElement();
    let resizeInput: any = flyoutElement.querySelector('.sky-flyout-resize-handle');

    expect(flyoutElement.style.width).toBe('500px');
    expect(resizeInput.getAttribute('aria-controls')).toBe(flyoutElement.id);

    expect(resizeInput.getAttribute('aria-valuenow')).toBe('500');
    expect(resizeInput.getAttribute('aria-valuemax')).toBe('1000');
    expect(resizeInput.getAttribute('aria-valuemin')).toBe('200');

    expect(resizeInput.getAttribute('max')).toBe('1000');
    expect(resizeInput.getAttribute('min')).toBe('200');
  }));

  it('should set iframe styles correctly during dragging', fakeAsync(() => {
    openFlyout({}, true);
    const iframe = getIframe();

    expect(iframe.style.pointerEvents).toBeFalsy();

    grabDragHandle(1000);

    expect(iframe.style.pointerEvents).toBe('none');

    dragHandle(500);

    expect(iframe.style.pointerEvents).toBe('none');

    releaseDragHandle();

    expect(iframe.style.pointerEvents).toBeFalsy();
  }));

  it('should respect minimum and maximum when resizing', fakeAsync(() => {
    openFlyout({ maxWidth: 1000, minWidth: 200 });
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    resizeFlyout(1000, 500);

    expect(flyoutElement.style.width).toBe('1000px');

    resizeFlyout(500, 200);

    expect(flyoutElement.style.width).toBe('1000px');

    resizeFlyout(500, 1300);

    expect(flyoutElement.style.width).toBe('200px');

    resizeFlyout(1300, 1400);

    expect(flyoutElement.style.width).toBe('200px');
  })
  );

  it('should not resize when handle is not clicked',
    fakeAsync(() => {

      openFlyout({});
      const flyoutElement = getFlyoutElement();

      expect(flyoutElement.style.width).toBe('500px');
      makeEvent('mousemove', { clientX: 1100 });
      fixture.detectChanges();
      expect(flyoutElement.style.width).toBe('500px');
    })
  );

  it('should prevent click events from bubbling beyond the flyout component', fakeAsync(() => {
    openFlyout({ maxWidth: 1000, minWidth: 200 });
    const flyout = document.querySelector('.sky-flyout');

    let numDocumentClicks = 0;
    document.addEventListener('click', function () {
      numDocumentClicks++;
    });

    let numFlyoutClicks = 0;
    flyout.addEventListener('click', function () {
      numFlyoutClicks++;
    });

    SkyAppTestUtility.fireDomEvent(flyout, 'click');

    expect(numFlyoutClicks).toEqual(1);
    expect(numDocumentClicks).toEqual(0);
  }));

  describe('permalink', () => {
    it('should not show the permalink button if no permalink config peroperties are defined',
      fakeAsync(() => {
        openFlyout();
        const permaLinkButton = getPermalinkButtonElement();
        expect(permaLinkButton).toBeFalsy();
      })
    );

    it('should use the default permalink label if none is defined',
      fakeAsync(() => {
        const expectedPermalink = 'http://bb.com';
        const expectedLabel = 'View record';

        openFlyout({
          permalink: {
            url: expectedPermalink
          }
        });

        const permaLinkButton = getPermalinkButtonElement();
        expect(permaLinkButton).toBeTruthy();
        expect(permaLinkButton.innerHTML.trim()).toEqual(expectedLabel);
      })
    );

    it('should use the custom defined label for permalink',
      fakeAsync(() => {
        const expectedPermalink = 'http://bb.com';
        const expectedLabel = 'Foo Bar';

        openFlyout({
          permalink: {
            label: expectedLabel,
            url: expectedPermalink
          }
        });

        const permaLinkButton = getPermalinkButtonElement();
        expect(permaLinkButton).toBeTruthy();
        expect(permaLinkButton.innerHTML.trim()).toEqual(expectedLabel);
      })
    );

    it('should open the defined permalink URL when clicking on the permalink button',
      fakeAsync(() => {
        const expectedPermalink = 'http://bb.com';
        openFlyout({
          permalink: {
            url: expectedPermalink
          }
        });
        const permaLinkButton = getPermalinkButtonElement();
        expect(permaLinkButton.getAttribute('href')).toEqual(expectedPermalink);
      })
    );

    it('should navigate to a route when clicking on the permalink button',
      fakeAsync(() => {
        openFlyout({
          permalink: {
            route: {
              commands: ['/'],
              extras: {
                fragment: 'fooFragment',
                queryParams: {
                  envid: 'fooId'
                }
              }
            }
          }
        });
        const permalinkButton = getPermalinkButtonElement();
        expect(permalinkButton.getAttribute('href')).toEqual('/?envid=fooId#fooFragment');
      })
    );

    it('should navigate to a URL when clicking on the permalink button',
      fakeAsync(() => {
        openFlyout({
          permalink: {
            url: 'http://foo.com'
          }
        });
        const permalinkButton = getPermalinkButtonElement();
        expect(permalinkButton.getAttribute('href')).toEqual('http://foo.com');
      })
    );
  });

  describe('primary action', () => {
    it('should not show the primary action button if no action is configured',
      fakeAsync(() => {
        openFlyout();
        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeFalsy();
      })
    );

    it('should use the default primary action label if none is defined',
      fakeAsync(() => {
        const expectedLabel = 'Create list';

        openFlyout({
          primaryAction: {
            callback: () => { }
          }
        });

        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeTruthy();
        expect(primaryActionButton.innerHTML.trim()).toEqual(expectedLabel);
      })
    );

    it('should use the custom defined label for primary action',
      fakeAsync(() => {
        const expectedLabel = 'Create list';

        openFlyout({
          primaryAction: {
            callback: () => { },
            label: expectedLabel
          }
        });

        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeTruthy();
        expect(primaryActionButton.innerHTML.trim()).toEqual(expectedLabel);
      })
    );

    it('should invoke the primary action callback when clicking on the primary action button',
      fakeAsync(() => {
        let primaryActionInvoked = false;

        openFlyout({
          primaryAction: {
            callback: () => {
              primaryActionInvoked = true;
            }
          }
        });

        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeTruthy();
        primaryActionButton.click();

        // let the close message propagate
        applicationRef.tick();
        tick();

        expect(primaryActionInvoked).toBe(true);
      })
    );

    it('should close the flyout after invoking the primary action if configured to do so',
      fakeAsync(() => {
        const flyoutInstance = openFlyout({
          primaryAction: {
            callback: () => { },
            closeAfterInvoking: true
          }
        });

        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeTruthy();
        primaryActionButton.click();

        // let the close message propagate
        applicationRef.tick();
        tick();

        expect(flyoutInstance.isOpen).toBeFalsy();
      })
    );

    it('should not close the flyout after invoking the primary action if not configured to do so',
      fakeAsync(() => {
        const flyoutInstance = openFlyout({
          primaryAction: {
            callback: () => { },
            closeAfterInvoking: false
          }
        });

        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeTruthy();
        primaryActionButton.click();

        // let the close message propagate
        applicationRef.tick();
        tick();

        expect(flyoutInstance.isOpen).toBeTruthy();
      })
    );

    it('should not close the flyout after invoking the primary action if configuration is not set',
      fakeAsync(() => {
        const flyoutInstance = openFlyout({
          primaryAction: {
            callback: () => { }
          }
        });

        const primaryActionButton = getPrimaryActionButtonElement();
        expect(primaryActionButton).toBeTruthy();
        primaryActionButton.click();

        // let the close message propagate
        applicationRef.tick();
        tick();

        expect(flyoutInstance.isOpen).toBeTruthy();
      })
    );
  });

  describe('iterator', () => {
    function getIteratorButtons(): NodeListOf<HTMLButtonElement> {
      return document.querySelectorAll('#iterators button') as NodeListOf<HTMLButtonElement>;
    }

    it('should not show iterator buttons if config.showIterator is undefined', fakeAsync(() => {
      openFlyout();
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(0);
    }));

    it('should not show iterator buttons if config.showIterator is false', fakeAsync(() => {
      openFlyout({
        showIterator: false
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(0);
    }));

    it('should show iterator buttons if config.showIterator is true', fakeAsync(() => {
      openFlyout({
        showIterator: true
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
    }));

    it('should disable iterator buttons if config disabled properties are true', fakeAsync(() => {
      openFlyout({
        showIterator: true,
        iteratorPreviousButtonDisabled: true,
        iteratorNextButtonDisabled: true
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeTruthy();
      expect(iteratorButtons[1].disabled).toBeTruthy();
    }));

    it('should enable iterator buttons if disabled properties are false', fakeAsync(() => {
      openFlyout({
        showIterator: true,
        iteratorPreviousButtonDisabled: false,
        iteratorNextButtonDisabled: false
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
    }));

    it('should emit if previous button is clicked', fakeAsync(() => {
      let previousCalled = false;
      let nextCalled = false;

      const flyoutInstance = openFlyout({
        showIterator: true
      });

      flyoutInstance.iteratorPreviousButtonClick.subscribe(() => {
        previousCalled = true;
      });

      flyoutInstance.iteratorNextButtonClick.subscribe(() => {
        nextCalled = true;
      });

      const iteratorButtons = getIteratorButtons();
      iteratorButtons[0].click();
      fixture.detectChanges();
      tick();
      expect(previousCalled).toEqual(true);
      expect(nextCalled).toEqual(false);
    }));

    it('should emit if next button is clicked', fakeAsync(() => {
      let previousCalled = false;
      let nextCalled = false;

      const flyoutInstance = openFlyout({
        showIterator: true
      });

      flyoutInstance.iteratorPreviousButtonClick.subscribe(() => {
        previousCalled = true;
      });

      flyoutInstance.iteratorNextButtonClick.subscribe(() => {
        nextCalled = true;
      });

      const iteratorButtons = getIteratorButtons();
      iteratorButtons[1].click();
      fixture.detectChanges();
      tick();
      expect(previousCalled).toEqual(false);
      expect(nextCalled).toEqual(true);
    }));

    it('should not emit if iterator buttons are clicked when config properties are disabled', fakeAsync(() => {
      let previousCalled = false;
      let nextCalled = false;

      const flyoutInstance = openFlyout({
        showIterator: true,
        iteratorPreviousButtonDisabled: true,
        iteratorNextButtonDisabled: true
      });

      flyoutInstance.iteratorPreviousButtonClick.subscribe(() => {
        previousCalled = true;
      });

      flyoutInstance.iteratorNextButtonClick.subscribe(() => {
        nextCalled = true;
      });

      const iteratorButtons = getIteratorButtons();
      iteratorButtons[0].click();
      iteratorButtons[1].click();
      fixture.detectChanges();
      tick();
      expect(previousCalled).toEqual(false);
      expect(nextCalled).toEqual(false);
    }));

    it('should allow consumer to enable/disable buttons after flyout is opened', fakeAsync(() => {
      const flyout = openFlyout({
        showIterator: true
      });
      const iteratorButtons = getIteratorButtons();

      // Expect flyout to have iterator buttons, both enabled.
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
      expect(flyout.iteratorNextButtonDisabled).toEqual(false);
      expect(flyout.iteratorPreviousButtonDisabled).toEqual(false);

      flyout.iteratorPreviousButtonDisabled = true;
      flyout.iteratorNextButtonDisabled = true;
      fixture.detectChanges();

      // Expect flyout to have iterator buttons, both disabled.
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeTruthy();
      expect(iteratorButtons[1].disabled).toBeTruthy();
      expect(flyout.iteratorNextButtonDisabled).toEqual(true);
      expect(flyout.iteratorPreviousButtonDisabled).toEqual(true);

      flyout.iteratorPreviousButtonDisabled = false;
      flyout.iteratorNextButtonDisabled = false;
      fixture.detectChanges();

      // Expect flyout to have iterator buttons, both enabled.
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
      expect(flyout.iteratorNextButtonDisabled).toEqual(false);
      expect(flyout.iteratorPreviousButtonDisabled).toEqual(false);
    }));
  });

  describe('responsive classes', () => {
    it('should add the xs class when appropriate', fakeAsync(() => {
      openFlyout({ maxWidth: 10000, minWidth: 50 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 1100);

      expect(flyoutElement.style.width).toBe('400px');
      expect(flyoutHostElement.classList.contains('sky-responsive-container-xs')).toBeTruthy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-sm')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-md')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-lg')).toBeFalsy();
    }));

    it('should add the xs class when appropriate due to xs screen size', fakeAsync(() => {
      openFlyout({ maxWidth: 10000, minWidth: 50 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();

      resizeFlyout(1000, 600);

      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(767);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(flyoutHostElement.classList.contains('sky-responsive-container-xs')).toBeTruthy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-sm')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-md')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-lg')).toBeFalsy();
    }));

    it('should add the sm class when appropriate', fakeAsync(() => {
      openFlyout({ maxWidth: 10000, minWidth: 50 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 600);

      expect(flyoutElement.style.width).toBe('900px');
      expect(flyoutHostElement.classList.contains('sky-responsive-container-sm')).toBeTruthy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-xs')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-md')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-lg')).toBeFalsy();
    }));

    it('should add the md class when appropriate', fakeAsync(() => {
      openFlyout({ maxWidth: 10000, minWidth: 50 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 400);

      expect(flyoutElement.style.width).toBe('1100px');
      expect(flyoutHostElement.classList.contains('sky-responsive-container-md')).toBeTruthy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-xs')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-sm')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-lg')).toBeFalsy();
    }));

    it('should add the lg class when appropriate', fakeAsync(() => {
      openFlyout({ maxWidth: 10000, minWidth: 50 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 100);

      expect(flyoutElement.style.width).toBe('1400px');
      expect(flyoutHostElement.classList.contains('sky-responsive-container-lg')).toBeTruthy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-xs')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-sm')).toBeFalsy();
      expect(flyoutHostElement.classList.contains('sky-responsive-container-md')).toBeFalsy();
    }));
  });

  describe('responsive states', () => {
    it('should call the host listener correctly on resize', fakeAsync(() => {
      const resizeSpy = spyOn(SkyFlyoutComponent.prototype, 'onWindowResize').and.callThrough();

      openFlyout();

      expect(resizeSpy).not.toHaveBeenCalled();

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(resizeSpy).toHaveBeenCalled();
    }));
  });

  it('should set the media query service breakpoint to the window size when xs via resize',
    fakeAsync(() => {
      const breakpointSpy = spyOn(SkyFlyoutMediaQueryService.prototype, 'setBreakpointForWidth')
        .and.callThrough();

      openFlyout();

      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(767);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(breakpointSpy).toHaveBeenCalledWith(767);
    }));

  it(`should set the media query service breakpoint to the flyout size when larger
    than xs via resize`, fakeAsync(() => {
    const breakpointSpy = spyOn(SkyFlyoutMediaQueryService.prototype, 'setBreakpointForWidth')
      .and.callThrough();
    const windowSizeSpy = spyOnProperty(window, 'innerWidth', 'get');

    openFlyout();

    windowSizeSpy.and.returnValue(800);

    SkyAppTestUtility.fireDomEvent(window, 'resize');

    expect(breakpointSpy).toHaveBeenCalledWith(500);

    windowSizeSpy.and.returnValue(1000);

    SkyAppTestUtility.fireDomEvent(window, 'resize');

    expect(breakpointSpy).toHaveBeenCalledWith(500);

    windowSizeSpy.and.returnValue(1400);

    SkyAppTestUtility.fireDomEvent(window, 'resize');

    expect(breakpointSpy).toHaveBeenCalledWith(500);
  }));

  it('should set the media query service breakpoint to the window size when xs via resize',
    fakeAsync(() => {
      const breakpointSpy = spyOn(SkyFlyoutMediaQueryService.prototype, 'setBreakpointForWidth')
        .and.callThrough();
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(767);

      openFlyout();

      expect(breakpointSpy).toHaveBeenCalledWith(767);
    }));

  it(`should set the media query service breakpoint to the flyout size when larger
  than xs on load`, fakeAsync(() => {
    const breakpointSpy = spyOn(SkyFlyoutMediaQueryService.prototype, 'setBreakpointForWidth')
      .and.callThrough();
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(800);

    openFlyout();

    expect(breakpointSpy).toHaveBeenCalledWith(500);
  }));
});
