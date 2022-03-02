import { ApplicationRef, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { MockSkyMediaQueryService } from '@skyux/core/testing';
import { SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarSecondaryActionsComponent } from './actions/summary-action-bar-secondary-actions.component';
import { SkySummaryActionBarSplitViewTestComponent } from './fixtures/summary-action-bar-split-view.component.fixture';
import { SkySummaryActionBarTabsTestComponent } from './fixtures/summary-action-bar-tabs.component.fixture';
import { SkySummaryActionBarTestComponent } from './fixtures/summary-action-bar.component.fixture';
import { SkySummaryActionBarFixtureModule } from './fixtures/summary-action-bar.module.fixture';
import { SkySummaryActionBarAdapterService } from './summary-action-bar-adapter.service';
import { SkySummaryActionBarComponent } from './summary-action-bar.component';

describe('Summary Action Bar component', () => {
  let mockMediaQueryService: MockSkyMediaQueryService;

  beforeEach(() => {
    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [SkySummaryActionBarFixtureModule],
    });

    TestBed.overrideComponent(SkySummaryActionBarSecondaryActionsComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService,
          },
        ],
      },
    }).overrideComponent(SkySummaryActionBarComponent, {
      add: {
        providers: [
          SkySummaryActionBarAdapterService,
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService,
          },
        ],
      },
    });
  });

  describe('standard usage', () => {
    let fixture: ComponentFixture<SkySummaryActionBarTestComponent>;
    let cmp: SkySummaryActionBarTestComponent;
    let debugElement: DebugElement;
    let modalService: SkyModalService;

    beforeEach(inject(
      [SkyModalService, ApplicationRef],
      (_modalService: SkyModalService, _applicationRef: ApplicationRef) => {
        modalService = _modalService;
      }
    ));

    beforeEach(() => {
      fixture = TestBed.createComponent(SkySummaryActionBarTestComponent);

      cmp = fixture.componentInstance as SkySummaryActionBarTestComponent;
      debugElement = fixture.debugElement;
    });

    afterEach(() => {
      modalService.dispose();
      fixture.detectChanges();
      fixture.destroy();
    });

    describe('body stylings', () => {
      it('should set a margin on the body if the action bar is not in a modal footer', () => {
        fixture.detectChanges();
        const actionBarHeight = debugElement.query(
          By.css('.sky-summary-action-bar')
        ).nativeElement.offsetHeight;
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
      });

      it('should set a new margin when the summary area changes collapsed state', fakeAsync(() => {
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        let actionBarHeight = debugElement.query(
          By.css('.sky-summary-action-bar')
        ).nativeElement.offsetHeight;
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
        debugElement
          .query(By.css('.sky-summary-action-bar-details-collapse button'))
          .nativeElement.click();
        actionBarHeight = debugElement.query(By.css('.sky-summary-action-bar'))
          .nativeElement.offsetHeight;
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
      }));

      it('should set a new margin on the body if the window is resized', () => {
        const initialBottomMargin = document.body.style.marginBottom;
        fixture.detectChanges();
        const resizeEvent: any = document.createEvent('CustomEvent');
        resizeEvent.initEvent('resize', true, true);
        window.dispatchEvent(resizeEvent);
        fixture.detectChanges();

        const finalBottomMargin = document.body.style.marginBottom;
        expect(initialBottomMargin).not.toEqual(finalBottomMargin);
      });

      it('should remove the margin on the body if the action bar is destroyed', () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        expect(document.body.style.marginBottom).toBe('');
      });

      it('should set a margin on the body if the action bar is not in a modal footer', () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        expect(document.body.style.marginBottom).toBe('');
      });
    });

    describe('summary recognition', () => {
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
    });

    describe('modal stylings', () => {
      it('should not add the modal class if the action bar is not in a modal footer', () => {
        fixture.detectChanges();
        expect(
          document.querySelector('.sky-summary-action-bar-modal')
        ).toBeNull();
      });

      it('should add the modal class if the action bar is in a modal footer', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        expect(
          document.querySelector('.sky-summary-action-bar-modal')
        ).not.toBeNull();
      });

      it('should remove the modal footer padding if the action bar is in a modal footer', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        expect(
          (document.querySelector('.sky-modal-footer-container') as HTMLElement)
            .style.padding
        ).toBe('0px');
      });

      it('should remove the correct modal footer padding if the action bar is in a modal footer and there are two modals', async(() => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#empty-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        (document.querySelector('#modal-trigger') as HTMLElement).click();
        fixture.detectChanges();
        expect(
          (
            document.querySelector(
              '#action-bar-modal .sky-modal-footer-container'
            ) as HTMLElement
          ).style.padding
        ).toBe('0px');
        expect(
          (
            document.querySelector(
              '#empty-modal .sky-modal-footer-container'
            ) as HTMLElement
          ).style.padding
        ).not.toBe('0px');
      }));
    });

    describe('media queries', () => {
      it('should set isSummaryCollapsible to false when on a large screen', () => {
        fixture.detectChanges();
        expect(cmp.summaryActionBar.isSummaryCollapsible).toBeFalsy();
      });

      it('should set isSummaryCollapsible to true when on a large screen but normal modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        expect(
          cmp.openedModal.summaryActionBar.isSummaryCollapsible
        ).toBeTruthy();
      });

      it('should set isSummaryCollapsible to false when on a large screen and full screen modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
        fixture.detectChanges();
        expect(
          cmp.openedModal.summaryActionBar.isSummaryCollapsible
        ).toBeFalsy();
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
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(
          cmp.openedModal.summaryActionBar.isSummaryCollapsible
        ).toBeTruthy();
      });

      it('should set isSummaryCollapsible to true when on a xs screen and full screen modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(
          cmp.openedModal.summaryActionBar.isSummaryCollapsible
        ).toBeTruthy();
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
    });

    describe('animations', () => {
      it('should update slide direction and isSummaryCollapsed when collapsing the summary', fakeAsync(() => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(cmp.summaryActionBar.isSummaryCollapsed).toBeFalsy();
        expect(cmp.summaryActionBar.slideDirection).toBe('down');
        debugElement
          .query(By.css('.sky-summary-action-bar-details-collapse button'))
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
        debugElement
          .query(By.css('.sky-summary-action-bar-details-collapse button'))
          .nativeElement.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(cmp.summaryActionBar.isSummaryCollapsed).toBeTruthy();
        expect(cmp.summaryActionBar.slideDirection).toBe('up');
        debugElement
          .query(By.css('.sky-summary-action-bar-details-expand button'))
          .nativeElement.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(cmp.summaryActionBar.isSummaryCollapsed).toBeFalsy();
        expect(cmp.summaryActionBar.slideDirection).toBe('down');
      }));
    });

    describe('switching', () => {
      it('should set a margin on the body if the action bar is switched with another', () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        cmp.showSecondaryActionBar = true;
        fixture.detectChanges();
        const actionBarHeight = debugElement.query(
          By.css('.sky-summary-action-bar')
        ).nativeElement.offsetHeight;
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
      });

      it('should set isSummaryCollapsible to true when on a xs screen on a replaced action bar', () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        cmp.showSecondaryActionBar = true;
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(cmp.summaryActionBar.isSummaryCollapsible).toBeTruthy();
      });
    });

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
          debugElement
            .query(By.css('.sky-summary-action-bar-details-collapse button'))
            .nativeElement.click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(fixture.nativeElement).toBeAccessible();
          });
        });
      }));

      it('should be accessible (modal setup)', async(() => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Testing modal host here due to the modal not being contained in the fixture
          const modalHostElem = document.querySelector('sky-modal-host');
          expect(modalHostElem).toBeAccessible();
          (
            document.querySelector('.sky-modal-btn-close') as HTMLElement
          ).click();
          fixture.detectChanges();
        });
      }));

      it('should be accessible (modal setup collapsed summary)', async(() => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement
          .query(By.css('#action-bar-modal-trigger'))
          .nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Using query selector here due to the modal not being inside the debugElement
          (
            document.querySelector(
              '.sky-summary-action-bar-details-collapse button'
            ) as HTMLElement
          ).click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            // Testing modal host here due to the modal not being contained in the fixture
            const modalHostElem = document.querySelector('sky-modal-host');
            expect(modalHostElem).toBeAccessible();
            (
              document.querySelector('.sky-modal-btn-close') as HTMLElement
            ).click();
            fixture.detectChanges();
          });
        });
      }));

      it('should be accessible (full screen modal lg setup)', async(() => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Testing modal host here due to the modal not being contained in the fixture
          const modalHostElem = document.querySelector('sky-modal-host');
          expect(modalHostElem).toBeAccessible();
          (
            document.querySelector('.sky-modal-btn-close') as HTMLElement
          ).click();
          fixture.detectChanges();
        });
      }));

      it('should be accessible (full screen modal xs setup)', async(() => {
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
          (
            document.querySelector('.sky-modal-btn-close') as HTMLElement
          ).click();
          fixture.detectChanges();
        });
      }));

      it('should be accessible (full screen modal xs setup collapsed summary)', async(() => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        debugElement.query(By.css('#full-modal-trigger')).nativeElement.click();
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Using query selector here due to the modal not being inside the debugElement
          (
            document.querySelector(
              '.sky-summary-action-bar-details-collapse button'
            ) as HTMLElement
          ).click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            // Testing modal host here due to the modal not being contained in the fixture
            const modalHostElem = document.querySelector('sky-modal-host');
            expect(modalHostElem).toBeAccessible();
            (
              document.querySelector('.sky-modal-btn-close') as HTMLElement
            ).click();
            fixture.detectChanges();
          });
        });
      }));
    });
  });

  describe('tab usage', () => {
    let fixture: ComponentFixture<SkySummaryActionBarTabsTestComponent>;
    let cmp: SkySummaryActionBarTabsTestComponent;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkySummaryActionBarTabsTestComponent);

      cmp = fixture.componentInstance as SkySummaryActionBarTabsTestComponent;
      debugElement = fixture.debugElement;
    });

    describe('body stylings', () => {
      it('should set a margin on the body if the action bar is displayed on intial load', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          setTimeout(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const actionBarHeight = debugElement.query(
                By.css('.sky-summary-action-bar')
              ).nativeElement.offsetHeight;
              expect(document.body.style.marginBottom).toBe(
                actionBarHeight + 'px'
              );
              done();
            });
          });
        });
      });

      it('should not set a margin on the body if the action bar is not displayed on intial load', () => {
        cmp.showBar1 = false;
        cmp.showBar2 = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body.style.marginBottom).toBe('');
        });
      });

      it('should set a margin on the body if the action bar is displayed via a selected tab', (done) => {
        cmp.showBar1 = false;
        cmp.showBar2 = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          cmp.activeTab = 1;
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            setTimeout(() => {
              fixture.detectChanges();
              fixture.whenStable().then(() => {
                const actionBarHeight = debugElement.query(
                  By.css('.sky-summary-action-bar')
                ).nativeElement.offsetHeight;
                expect(document.body.style.marginBottom).toBe(
                  actionBarHeight + 'px'
                );
                done();
              });
            });
          });
        });
      });

      it('should set a margin on the body if the action bar is displayed via multiple tab changes', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          cmp.activeTab = 1;
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            cmp.activeTab = 0;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              fixture.detectChanges();
              setTimeout(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                  const actionBarHeight = debugElement.query(
                    By.css('.sky-summary-action-bar')
                  ).nativeElement.offsetHeight;
                  expect(document.body.style.marginBottom).toBe(
                    actionBarHeight + 'px'
                  );
                  done();
                });
              });
            });
          });
        });
      });
    });

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
          debugElement
            .query(By.css('.sky-summary-action-bar-details-collapse button'))
            .nativeElement.click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(fixture.nativeElement).toBeAccessible();
          });
        });
      }));
    });
  });

  describe('split view usage', () => {
    let fixture: ComponentFixture<SkySummaryActionBarSplitViewTestComponent>;
    let cmp: SkySummaryActionBarSplitViewTestComponent;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(
        SkySummaryActionBarSplitViewTestComponent
      );

      cmp =
        fixture.componentInstance as SkySummaryActionBarSplitViewTestComponent;
      debugElement = fixture.debugElement;
    });

    describe('body stylings', () => {
      it('should set a margin on the split view workspace content if the action bar is displayed on intial load', (done) => {
        spyOn(window as any, 'setTimeout').and.callFake((fun: Function) => {
          fun();
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const workspacePaddingBottom = debugElement.query(
            By.css('.sky-split-view-workspace-content')
          ).nativeElement.style.paddingBottom;
          expect(workspacePaddingBottom).toBe('20px');
          done();
        });
      });

      it('should not set a margin on the body if the action bar is not displayed on intial load', () => {
        cmp.showBar = false;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const workspacePaddingBottom = debugElement.query(
            By.css('.sky-split-view-workspace-content')
          ).nativeElement.style.paddingBottom;
          expect(workspacePaddingBottom).toBe('');
        });
      });
    });

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
          debugElement
            .query(By.css('.sky-summary-action-bar-details-collapse button'))
            .nativeElement.click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(fixture.nativeElement).toBeAccessible();
          });
        });
      }));
    });
  });
});
