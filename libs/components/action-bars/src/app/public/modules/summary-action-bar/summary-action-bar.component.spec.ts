import {
  ApplicationRef,
  DebugElement
} from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  async
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyModalService
} from '@skyux/modals';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkySummaryActionBarTestComponent
} from './fixtures/summary-action-bar.component.fixture';

import {
  SkySummaryActionBarFixtureModule
} from './fixtures/summary-action-bar.module.fixture';

import {
  SkySummaryActionBarComponent
} from './summary-action-bar.component';

import {
  SkySummaryActionBarAdapterService,
  SkySummaryActionBarSecondaryActionsComponent
} from '.';

describe('Summary Action Bar action components', () => {
  let fixture: ComponentFixture<SkySummaryActionBarTestComponent>;
  let cmp: SkySummaryActionBarTestComponent;
  let debugElement: DebugElement;
  let mockMediaQueryService: MockSkyMediaQueryService;
  let modalService: SkyModalService;

  beforeEach(() => {

    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [
        SkySummaryActionBarFixtureModule
      ]
    });

    TestBed.overrideComponent(SkySummaryActionBarSecondaryActionsComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService
          }
        ]
      }
    })
      .overrideComponent(SkySummaryActionBarComponent, {
        add: {
          providers: [
            {
              provide: SkyMediaQueryService,
              useValue: mockMediaQueryService
            }
          ]
        }
      });
  });

  beforeEach(
    inject(
      [
        SkyModalService,
        ApplicationRef
      ],
      (
        _modalService: SkyModalService,
        _applicationRef: ApplicationRef
      ) => {
        modalService = _modalService;
      }
    )
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SkySummaryActionBarTestComponent);

    cmp = fixture.componentInstance as SkySummaryActionBarTestComponent;
    debugElement = fixture.debugElement;
  });

  afterEach(() => {
    modalService.dispose();
    fixture.detectChanges();
  });

  it('should set a margin on the body if the action bar is not in a modal footer', () => {
    fixture.detectChanges();
    let actionBarHeight = debugElement.query(By.css('.sky-summary-action-bar')).nativeElement.offsetHeight;
    expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
  });

  it('should set a new margin on the body if the window is resized', () => {
    let adapter: SkySummaryActionBarAdapterService = TestBed.get(SkySummaryActionBarAdapterService);
    spyOn(adapter, 'styleBodyElementForActionBar').and.stub();
    fixture.detectChanges();
    let resizeEvent: any = document.createEvent('CustomEvent');
    resizeEvent.initEvent('resize', true, true);
    window.dispatchEvent(resizeEvent);
    fixture.detectChanges();
    expect(adapter.styleBodyElementForActionBar).toHaveBeenCalledTimes(2);
  });

  it('should remove the margin on the body if the action bar is destroyed', () => {
    fixture.detectChanges();
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    expect(document.body.style.marginBottom).toBe('');
  });

  it('should set a margin on the body if the action bar is not in a modal footer', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    expect(document.body.style.marginBottom).toBe('');
  });

  it('should recognize when the summary has content', () => {
    fixture.detectChanges();
    expect(cmp.summaryActionBar.summaryContentExists()).toBeTruthy();
  });

  it('should recognize when the summary no has content', () => {
    cmp.noSummaryContent = true;
    fixture.detectChanges();
    expect(cmp.summaryActionBar.summaryContentExists()).toBeFalsy();
  });

  it('should recognize when the summary tag does not exist', () => {
    cmp.noSummary = true;
    fixture.detectChanges();
    expect(cmp.summaryActionBar.summaryContentExists()).toBeFalsy();
  });

  it('should not add the modal class if the action bar is not in a modal footer', () => {
    fixture.detectChanges();
    expect(document.querySelector('.sky-summary-action-bar-modal')).toBeNull();
  });

  it('should add the modal class if the action bar is in a modal footer', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    expect(document.querySelector('.sky-summary-action-bar-modal')).not.toBeNull();
  });

  it('should remove the modal footer padding if the action bar is in a modal footer', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    expect((<HTMLElement>document.querySelector('.sky-modal-footer-container')).style.padding).toBe('0px');
  });

  it('should set isSummaryCollapsible to false when on a large screen', () => {
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsible).toBeFalsy();
  });

  it('should set isSummaryCollapsible to true when on a large screen but normal modal', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    expect(cmp.openedModal.summaryActionBar.isSummaryCollapsible).toBeTruthy();
  });

  it('should set isSummaryCollapsible to false when on a large screen and full screen modal', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    expect(cmp.openedModal.summaryActionBar.isSummaryCollapsible).toBeFalsy();
  });

  it('should set isSummaryCollapsible to true when on a xs screen', () => {
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsible).toBeTruthy();
  });

  it('should set isSummaryCollapsible to true when on a xs screen and normal modal', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expect(cmp.openedModal.summaryActionBar.isSummaryCollapsible).toBeTruthy();
  });

  it('should set isSummaryCollapsible to true when on a xs screen and full screen modal', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expect(cmp.openedModal.summaryActionBar.isSummaryCollapsible).toBeTruthy();
  });

  it('should set isSummaryCollapsed to false when moving from a xs screen to a large screen', () => {
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    cmp.summaryActionBar.isSummaryCollapsed = true;
    mockMediaQueryService.fire(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsed).toBeFalsy();
  });

  it('should set isSummaryCollapsed to false when moving from a xs screen to a large screen in a full screen modal', () => {
    cmp.hideMainActionBar = true;
    fixture.detectChanges();
    debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    cmp.openedModal.summaryActionBar.isSummaryCollapsed = true;
    mockMediaQueryService.fire(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    expect(cmp.openedModal.summaryActionBar.isSummaryCollapsed).toBeFalsy();
  });

  it('should update slide direction and isSummaryCollapsed when collapsing the summary', fakeAsync(() => {
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsed).toBeFalsy();
    expect(cmp.summaryActionBar.slideDirection).toBe('down');
    debugElement.query(By.css('.sky-summary-action-bar-details-collapse button'))
      .nativeElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsed).toBeTruthy();
    expect(cmp.summaryActionBar.slideDirection).toBe('up');
  }));

  it('should update slide direction and isSummaryCollapsed when expanding the summary', fakeAsync(() => {
    fixture.detectChanges();
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    debugElement.query(By.css('.sky-summary-action-bar-details-collapse button'))
      .nativeElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsed).toBeTruthy();
    expect(cmp.summaryActionBar.slideDirection).toBe('up');
    debugElement.query(By.css('.sky-summary-action-bar-details-expand button'))
      .nativeElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(cmp.summaryActionBar.isSummaryCollapsed).toBeFalsy();
    expect(cmp.summaryActionBar.slideDirection).toBe('down');
  }));

  describe('a11y', () => {
    it('should be accessible (standard lg setup)', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible (standard xs setup)', async(() => {
      fixture.detectChanges();
      mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible (standard xs setup collapsed summary)', async(() => {
      fixture.detectChanges();
      mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        debugElement.query(By.css('.sky-summary-action-bar-details-collapse button'))
          .nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
        });
      });
    }));

    it('should be accessible (modal setup)', (done) => {
      fixture.detectChanges();
      cmp.hideMainActionBar = true;
      fixture.detectChanges();
      debugElement.query(By.css('#modal-trigger')).nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = document.querySelector('sky-modal-host');
        expect(modalHostElem).toBeAccessible();
        (<HTMLElement> document.querySelector('.sky-modal-btn-close')).click();
        fixture.detectChanges();
        done();
      });
    });

    it('should be accessible (modal setup collapsed summary)', (done) => {
      fixture.detectChanges();
      cmp.hideMainActionBar = true;
      fixture.detectChanges();
      debugElement.query(By.css('#modal-trigger')).nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // Using query selector here due to the modal not being inside the debugElement
        (<HTMLElement>document.querySelector('.sky-summary-action-bar-details-collapse button'))
          .click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Testing modal host here due to the modal not being contained in the fixture
          const modalHostElem = document.querySelector('sky-modal-host');
          expect(modalHostElem).toBeAccessible();
          (<HTMLElement> document.querySelector('.sky-modal-btn-close')).click();
          fixture.detectChanges();
          done();
        });
      });
    });

    it('should be accessible (full screen modal lg setup)', (done) => {
      fixture.detectChanges();
      cmp.hideMainActionBar = true;
      fixture.detectChanges();
      debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
          // Testing modal host here due to the modal not being contained in the fixture
          const modalHostElem = document.querySelector('sky-modal-host');
          expect(modalHostElem).toBeAccessible();
          (<HTMLElement> document.querySelector('.sky-modal-btn-close')).click();
          fixture.detectChanges();
          done();
      });
    });

    it('should be accessible (full screen modal xs setup)', (done) => {
      fixture.detectChanges();
      cmp.hideMainActionBar = true;
      fixture.detectChanges();
      debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
      fixture.detectChanges();
      mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = document.querySelector('sky-modal-host');
        expect(modalHostElem).toBeAccessible();
        (<HTMLElement> document.querySelector('.sky-modal-btn-close')).click();
        fixture.detectChanges();
        done();
      });
    });

    it('should be accessible (full screen modal xs setup collapsed summary)', (done) => {
      fixture.detectChanges();
      cmp.hideMainActionBar = true;
      fixture.detectChanges();
      debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
      fixture.detectChanges();
      mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // Using query selector here due to the modal not being inside the debugElement
        (<HTMLElement>document.querySelector('.sky-summary-action-bar-details-collapse button'))
          .click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Testing modal host here due to the modal not being contained in the fixture
          const modalHostElem = document.querySelector('sky-modal-host');
          expect(modalHostElem).toBeAccessible();
          (<HTMLElement> document.querySelector('.sky-modal-btn-close')).click();
          fixture.detectChanges();
          done();
        });
      });
    });
  });

});
