import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MockSkyMediaQueryService } from '@skyux/core/testing';
import { SkyAppViewportService } from '@skyux/theme';

import { SkySummaryActionBarSecondaryActionsComponent } from './actions/summary-action-bar-secondary-actions.component';
import { SkySummaryActionBarSplitViewTestComponent } from './fixtures/summary-action-bar-split-view.component.fixture';
import { SkySummaryActionBarTabsTestComponent } from './fixtures/summary-action-bar-tabs.component.fixture';
import { SkySummaryActionBarTestComponent } from './fixtures/summary-action-bar.component.fixture';
import { SkySummaryActionBarFixtureModule } from './fixtures/summary-action-bar.module.fixture';
import { SkySummaryActionBarAdapterService } from './summary-action-bar-adapter.service';
import { SkySummaryActionBarComponent } from './summary-action-bar.component';

describe('Summary Action Bar component', () => {
  function clickCollapseButton(debugElement: DebugElement): void {
    getCollapseButton(debugElement).click();
  }

  function clickExpandButton(debugElement: DebugElement): void {
    getExpandButton(debugElement).click();
  }

  function closeModal(): void {
    (document.querySelector('.sky-modal-btn-close') as HTMLElement).click();
  }

  function getActionBar(debugElement: DebugElement): HTMLElement {
    return debugElement.query(By.css('.sky-summary-action-bar'))?.nativeElement;
  }

  function getActionBarHeight(debugElement: DebugElement): number {
    return getActionBar(debugElement).offsetHeight;
  }

  function getCollapseButton(debugElement: DebugElement): HTMLElement {
    return debugElement.query(
      By.css('.sky-summary-action-bar-details-collapse button')
    )?.nativeElement;
  }

  function getExpandButton(debugElement: DebugElement): HTMLElement {
    return debugElement.query(
      By.css('.sky-summary-action-bar-details-expand button')
    )?.nativeElement;
  }

  function getModalActionBar(debugElement: DebugElement): HTMLElement {
    return debugElement.query(By.css('.sky-summary-action-bar-modal'))
      ?.nativeElement;
  }

  function getModalHost(): HTMLElement | null {
    return document.querySelector('sky-modal-host');
  }

  function getSummary(debugElement: DebugElement): HTMLElement {
    return debugElement.query(By.css('.sky-summary-action-bar-summary'))
      ?.nativeElement;
  }

  function toggleSummary(debugElement: DebugElement): void {
    debugElement.query(By.css('#summary-trigger'))?.nativeElement.click();
  }

  function openFullScreenModal(debugElement: DebugElement): void {
    debugElement.query(By.css('#full-modal-trigger'))?.nativeElement.click();
  }

  function openStandardModal(debugElement: DebugElement): void {
    debugElement
      .query(By.css('#action-bar-modal-trigger'))
      ?.nativeElement.click();
  }

  function validateCollapsible(
    parentEl: HTMLElement | null,
    expected: boolean
  ): void {
    expect(parentEl).not.toBeNull();

    let expectActionBar = expect(
      parentEl?.querySelector('.sky-summary-action-bar')
    );

    if (!expected) {
      expectActionBar = expectActionBar.not;
    }

    expectActionBar.toHaveCssClass(
      'sky-summary-action-bar-summary-collapsible'
    );
  }

  let mockMediaQueryService: MockSkyMediaQueryService;
  let viewportSvc: SkyAppViewportService;

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

    viewportSvc = TestBed.inject(SkyAppViewportService);
  });

  describe('standard usage', () => {
    let fixture: ComponentFixture<SkySummaryActionBarTestComponent>;
    let cmp: SkySummaryActionBarTestComponent;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkySummaryActionBarTestComponent);

      cmp = fixture.componentInstance as SkySummaryActionBarTestComponent;
      debugElement = fixture.debugElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('body stylings', () => {
      it('should set a margin on the body if the action bar is not in a modal footer', () => {
        fixture.detectChanges();
        const actionBarHeight = getActionBarHeight(debugElement);
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
      });

      it('should set a new margin when the summary area changes collapsed state', fakeAsync(() => {
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        let actionBarHeight = getActionBarHeight(debugElement);
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
        clickCollapseButton(debugElement);
        actionBarHeight = getActionBarHeight(debugElement);
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
      }));

      it('should set a new margin on the body if the window is resized', () => {
        const initialBottomMargin = document.body.style.marginBottom;
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(document, 'resize', {
          bubbles: true,
          cancelable: true,
        });
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
        openStandardModal(debugElement);
        fixture.detectChanges();
        expect(document.body.style.marginBottom).toBe('');
      });
    });

    describe('summary recognition', () => {
      it('should recognize when the summary has content', () => {
        fixture.detectChanges();
        expect(cmp.summaryActionBar).toBeTruthy();
        expect(cmp.summaryActionBar?.summaryContentExists()).toBeTruthy();
      });

      it('should recognize when the summary no has content', () => {
        cmp.noSummaryContent = true;
        fixture.detectChanges();
        expect(cmp.summaryActionBar).toBeTruthy();
        expect(cmp.summaryActionBar?.summaryContentExists()).toBeFalsy();
      });

      it('should recognize when the summary tag does not exist', () => {
        cmp.noSummary = true;
        fixture.detectChanges();
        expect(cmp.summaryActionBar).toBeTruthy();
        expect(cmp.summaryActionBar?.summaryContentExists()).toBeFalsy();
      });

      it('should recognize when the summary tag when it is toggled externally', () => {
        fixture.detectChanges();
        expect(getSummary(debugElement)).toExist();
        toggleSummary(debugElement);
        fixture.detectChanges();
        expect(getSummary(debugElement)).not.toExist();
        toggleSummary(debugElement);
        fixture.detectChanges();
        expect(getSummary(debugElement)).toExist();
      });
    });

    describe('dimensions', () => {
      it('should conform to the available viewport', () => {
        viewportSvc.reserveSpace({
          id: 'summary-action-bar-test-left',
          position: 'left',
          size: 20,
        });

        viewportSvc.reserveSpace({
          id: 'summary-action-bar-test-right',
          position: 'right',
          size: 30,
        });

        viewportSvc.reserveSpace({
          id: 'summary-action-bar-test-bottom',
          position: 'bottom',
          size: 40,
        });

        fixture.detectChanges();

        const actionBarEl = getActionBar(fixture.debugElement);
        const actionBarBounds = actionBarEl.getBoundingClientRect();

        expect(actionBarBounds.left).toBe(20);
        expect(actionBarBounds.right).toBe(window.innerWidth - 30);
        expect(actionBarBounds.bottom).toBe(window.innerHeight - 40);
      });
    });

    describe('modal stylings', () => {
      it('should not add the modal class if the action bar is not in a modal footer', () => {
        fixture.detectChanges();
        expect(getModalActionBar(debugElement)).toBeUndefined();
      });

      it('should add the modal class if the action bar is in a modal footer', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openStandardModal(debugElement);
        fixture.detectChanges();
        expect(getModalActionBar(debugElement)).not.toBeNull();
      });

      it('should remove the modal footer padding if the action bar is in a modal footer', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openStandardModal(debugElement);
        fixture.detectChanges();
        expect(
          (document.querySelector('.sky-modal-footer-container') as HTMLElement)
            .style.padding
        ).toBe('0px');
      });

      it('should remove the correct modal footer padding if the action bar is in a modal footer and there are two modals', async () => {
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
      });
    });

    describe('media queries', () => {
      it('should set isSummaryCollapsible to false when on a large screen', () => {
        fixture.detectChanges();
        validateCollapsible(debugElement.nativeElement, false);
      });

      it('should set isSummaryCollapsible to true when on a large screen but normal modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openStandardModal(debugElement);
        fixture.detectChanges();

        validateCollapsible(getModalHost(), true);
      });

      it('should set isSummaryCollapsible to false when on a large screen and full screen modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openFullScreenModal(debugElement);
        fixture.detectChanges();
        validateCollapsible(getModalHost(), false);
      });

      it('should set isSummaryCollapsible to true when on a xs screen', () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        validateCollapsible(debugElement.nativeElement, true);
      });

      it('should recognize when the summary tag when it is toggled externally when on a xs screen', () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(getSummary(debugElement)).toExist();
        toggleSummary(debugElement);
        fixture.detectChanges();
        expect(getSummary(debugElement)).not.toExist();
        toggleSummary(debugElement);
        fixture.detectChanges();
        expect(getSummary(debugElement)).toExist();
      });

      it('should set isSummaryCollapsible to true when on a xs screen and normal modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openStandardModal(debugElement);
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        validateCollapsible(getModalHost(), true);
      });

      it('should set isSummaryCollapsible to true when on a xs screen and full screen modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openFullScreenModal(debugElement);
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(cmp.openedModal?.summaryActionBar).toBeTruthy();
        validateCollapsible(getModalHost(), true);
      });

      it('should set isSummaryCollapsed to false when moving from a xs screen to a large screen', () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(cmp.summaryActionBar).toBeTruthy();
        (
          cmp.summaryActionBar as SkySummaryActionBarComponent
        ).isSummaryCollapsed = true;
        mockMediaQueryService.fire(SkyMediaBreakpoints.lg);
        fixture.detectChanges();
        expect(cmp.summaryActionBar?.isSummaryCollapsed).toBeFalsy();
      });

      it('should set isSummaryCollapsed to false when moving from a xs screen to a large screen in a full screen modal', () => {
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openFullScreenModal(debugElement);
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        expect(cmp.openedModal).toBeTruthy();

        fixture.detectChanges();

        const summaryActionBar = cmp.openedModal
          ?.summaryActionBar as SkySummaryActionBarComponent;
        expect(summaryActionBar).toBeTruthy();

        summaryActionBar.isSummaryCollapsed = true;
        mockMediaQueryService.fire(SkyMediaBreakpoints.lg);

        fixture.detectChanges();

        expect(
          cmp.openedModal?.summaryActionBar?.isSummaryCollapsed
        ).toBeFalsy();
      });
    });

    describe('animations', () => {
      it('should update slide direction and isSummaryCollapsed when collapsing the summary', fakeAsync(() => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        expect(cmp.summaryActionBar).toBeTruthy();
        expect(cmp.summaryActionBar?.isSummaryCollapsed).toBeFalsy();
        expect(cmp.summaryActionBar?.slideDirection).toBe('down');
        clickCollapseButton(debugElement);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(cmp.summaryActionBar?.isSummaryCollapsed).toBeTruthy();
        expect(cmp.summaryActionBar?.slideDirection).toBe('up');
      }));

      it('should update slide direction and isSummaryCollapsed when expanding the summary', fakeAsync(() => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        clickCollapseButton(debugElement);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(cmp.summaryActionBar).toBeTruthy();
        expect(cmp.summaryActionBar?.isSummaryCollapsed).toBeTruthy();
        expect(cmp.summaryActionBar?.slideDirection).toBe('up');
        clickExpandButton(debugElement);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(cmp.summaryActionBar?.isSummaryCollapsed).toBeFalsy();
        expect(cmp.summaryActionBar?.slideDirection).toBe('down');
      }));

      it(`should move focus to the collapsed summary's chevron after collapsing`, async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        clickCollapseButton(debugElement);
        // Allow animation to finish
        fixture.detectChanges();
        await fixture.whenStable();
        // ALlow focusing to take place
        fixture.detectChanges();
        await fixture.whenStable();
        const expandButton = getExpandButton(debugElement);
        expect(document.activeElement).toEqual(expandButton);
      });

      it(`should move focus to the expanded summary's chevron after expanding`, async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        clickCollapseButton(debugElement);
        // Allow animation to finish
        fixture.detectChanges();
        await fixture.whenStable();
        // ALlow focusing to take place
        fixture.detectChanges();
        await fixture.whenStable();
        clickExpandButton(debugElement);
        // Allow animation to finish
        fixture.detectChanges();
        await fixture.whenStable();
        // ALlow focusing to take place
        fixture.detectChanges();
        await fixture.whenStable();
        const collapseButton = getCollapseButton(debugElement);
        expect(document.activeElement).toEqual(collapseButton);
      });
    });

    describe('switching', () => {
      it('should set a margin on the body if the action bar is switched with another', () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        cmp.showSecondaryActionBar = true;
        fixture.detectChanges();
        const actionBarHeight = getActionBarHeight(debugElement);
        expect(document.body.style.marginBottom).toBe(actionBarHeight + 'px');
      });

      it('should set isSummaryCollapsible to true when on a xs screen on a replaced action bar', () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        cmp.showSecondaryActionBar = true;
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        validateCollapsible(debugElement.nativeElement, true);
      });
    });

    describe('a11y', () => {
      it('should be accessible (standard lg setup)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (standard xs setup)', async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (standard xs setup collapsed summary)', async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        clickCollapseButton(debugElement);
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (modal setup)', async () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openStandardModal(debugElement);
        fixture.detectChanges();
        await fixture.whenStable();
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = getModalHost();
        await expectAsync(modalHostElem).toBeAccessible();
        closeModal();
        fixture.detectChanges();
      });

      it('should be accessible (modal setup collapsed summary)', async () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openStandardModal(debugElement);
        fixture.detectChanges();
        await fixture.whenStable();
        // Using query selector here due to the modal not being inside the debugElement
        (
          document.querySelector(
            '.sky-summary-action-bar-details-collapse button'
          ) as HTMLElement
        ).click();
        fixture.detectChanges();
        await fixture.whenStable();
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = getModalHost();
        await expectAsync(modalHostElem).toBeAccessible();
        closeModal();
        fixture.detectChanges();
      });

      it('should be accessible (full screen modal lg setup)', async () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openFullScreenModal(debugElement);
        fixture.detectChanges();
        await fixture.whenStable();
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = getModalHost();
        await expectAsync(modalHostElem).toBeAccessible();
        closeModal();
        fixture.detectChanges();
      });

      it('should be accessible (full screen modal xs setup)', async () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openFullScreenModal(debugElement);
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = getModalHost();
        await expectAsync(modalHostElem).toBeAccessible();
        closeModal();
        fixture.detectChanges();
      });

      it('should be accessible (full screen modal xs setup collapsed summary)', async () => {
        fixture.detectChanges();
        cmp.hideMainActionBar = true;
        fixture.detectChanges();
        openFullScreenModal(debugElement);
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        // Using query selector here due to the modal not being inside the debugElement
        (
          document.querySelector(
            '.sky-summary-action-bar-details-collapse button'
          ) as HTMLElement
        ).click();
        fixture.detectChanges();
        await fixture.whenStable();
        // Testing modal host here due to the modal not being contained in the fixture
        const modalHostElem = getModalHost();
        await expectAsync(modalHostElem).toBeAccessible();
        closeModal();
        fixture.detectChanges();
      });
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
      it('should set a margin on the body if the action bar is displayed on initial load', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          setTimeout(async () => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const actionBarHeight = getActionBarHeight(debugElement);
              expect(document.body.style.marginBottom).toBe(
                actionBarHeight + 'px'
              );
              done();
            });
          });
        });
      });

      it('should not set a margin on the body if the action bar is not displayed on initial load', async () => {
        cmp.showBar1 = false;
        cmp.showBar2 = true;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(document.body.style.marginBottom).toBe('');
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
                const actionBarHeight = getActionBarHeight(debugElement);
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
                  const actionBarHeight = getActionBarHeight(debugElement);
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
      it('should be accessible (standard lg setup)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (standard xs setup)', async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (standard xs setup collapsed summary)', async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        clickCollapseButton(debugElement);
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
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
      it('should set a margin on the split view workspace content if the action bar is displayed on initial load', (done) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn(window as any, 'setTimeout').and.callFake((fun: () => void) => {
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

      it('should not set a margin on the body if the action bar is not displayed on initial load', async () => {
        cmp.showBar = false;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const workspacePaddingBottom = debugElement.query(
          By.css('.sky-split-view-workspace-content')
        ).nativeElement.style.paddingBottom;
        expect(workspacePaddingBottom).toBe('');
      });
    });

    describe('a11y', () => {
      it('should be accessible (standard lg setup)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (standard xs setup)', async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (standard xs setup collapsed summary)', async () => {
        fixture.detectChanges();
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
        fixture.detectChanges();
        await fixture.whenStable();
        clickCollapseButton(debugElement);
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  });
});
