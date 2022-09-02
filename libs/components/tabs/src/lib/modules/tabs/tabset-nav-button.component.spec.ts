import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';

import { SkyTabsFixturesModule } from './fixtures/tabs-fixtures.module';
import { SkyWizardTestFormComponent } from './fixtures/tabset-wizard.component.fixture';
import { SkyTabsetNavButtonComponent } from './tabset-nav-button.component';

describe('Tabset navigation button', () => {
  function getBtn(selector: string): HTMLButtonElement {
    return document.querySelector(selector) as HTMLButtonElement;
  }

  function getPreviousBtn(): HTMLButtonElement {
    return getBtn('sky-tabset-nav-button[buttonType="previous"] .sky-btn');
  }

  function getNextBtn(): HTMLButtonElement {
    return getBtn('sky-tabset-nav-button[buttonType="next"] .sky-btn');
  }

  function getFinishBtn(): HTMLButtonElement {
    return getBtn('sky-tabset-nav-button[buttonType="finish"] .sky-btn');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyTabsFixturesModule],
    });
  });

  it('should set default text based on the button type', () => {
    const fixture = TestBed.createComponent(SkyTabsetNavButtonComponent);

    fixture.componentInstance.buttonType = 'next';

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Next');

    fixture.componentInstance.buttonType = 'previous';

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Previous');
  });

  it('should allow the button text to be overridden', () => {
    const fixture = TestBed.createComponent(SkyTabsetNavButtonComponent);
    fixture.componentInstance.buttonType = 'previous';
    fixture.componentInstance.buttonText = 'Foo';

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Foo');
  });

  it('should be accessible', async () => {
    const fixture = TestBed.createComponent(SkyTabsetNavButtonComponent);
    fixture.componentInstance.buttonText = 'Foo';
    fixture.detectChanges();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('wizard style', () => {
    describe('without finish button', () => {
      it('should be accessible', async(async () => {
        const fixture = TestBed.createComponent(SkyWizardTestFormComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      }));

      describe('previous button', () => {
        it('should navigate to the previous tab when clicked', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          fixture.componentInstance.selectedTab = 1;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          const tabBtns = document.querySelectorAll('.sky-btn-tab-wizard');

          expect(tabBtns[1]).toHaveCssClass('sky-btn-tab-selected');

          const previousBtn = getPreviousBtn();

          previousBtn.click();
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(tabBtns[0]).toHaveCssClass('sky-btn-tab-selected');
        }));

        it('should be disabled if the first tab is selected', () => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.detectChanges();

          const previousBtn = getPreviousBtn();

          expect(previousBtn.disabled).toBe(true);
        });

        it('should have aria-controls set', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);
          fixture.componentInstance.selectedTab = 1;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          const previousBtn = getPreviousBtn();

          expect(previousBtn.getAttribute('aria-controls')).toBeDefined();
        }));
      });

      describe('next button', () => {
        it('should navigate to the next tab when clicked', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          const tabBtns = document.querySelectorAll('.sky-btn-tab-wizard');

          expect(tabBtns[0]).toHaveCssClass('sky-btn-tab-selected');

          const nextBtn = getNextBtn();

          nextBtn.click();
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(tabBtns[1]).toHaveCssClass('sky-btn-tab-selected');
        }));

        it('should be disabled if the next tab is disabled', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.step2Disabled = true;

          fixture.detectChanges();
          tick();

          const nextBtn = getNextBtn();

          expect(nextBtn.disabled).toBe(true);

          fixture.componentInstance.step2Disabled = false;

          fixture.detectChanges();
          tick();

          expect(nextBtn.disabled).toBe(false);
        }));

        it('should be disabled if the last tab is selected', () => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.selectedTab = 2;

          fixture.detectChanges();

          const nextBtn = getNextBtn();

          expect(nextBtn.disabled).toBe(true);
        });

        it('should have aria-controls set', () => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.detectChanges();

          const nextBtn = getNextBtn();

          expect(nextBtn.getAttribute('aria-controls')).toBeDefined();
        });
      });

      it('should log an error if the tabset is removed', () => {
        const fixture = TestBed.createComponent(SkyWizardTestFormComponent);
        const logService = TestBed.inject(SkyLogService);
        const errorLogSpy = spyOn(logService, 'error').and.stub();

        fixture.detectChanges();

        fixture.componentInstance.passTabset = false;

        fixture.detectChanges();

        expect(errorLogSpy).toHaveBeenCalledWith(
          'The SkyTabsetNavButtonComponent requires a reference to the SkyTabsetComponent it controls.'
        );
      });
    });
    describe('with finish button', () => {
      describe('next button', () => {
        it('should not be present if the last tab is selected', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 2;

          fixture.detectChanges();
          tick();

          fixture.detectChanges();
          tick();

          const nextBtn = getNextBtn();

          expect(nextBtn).toBeNull();
        }));
      });

      describe('finish button', () => {
        it('should set default text based on the button type', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 2;

          fixture.detectChanges();
          tick();

          fixture.detectChanges();
          tick();

          const finishBtn = getFinishBtn();

          expect(finishBtn).toHaveText('Finish');
        }));

        it('should not be present if the last tab is not selected', () => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 0;

          fixture.detectChanges();

          const finishBtn = getFinishBtn();

          expect(finishBtn).toBeNull();
        });

        it('should be present if the last tab is selected', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 2;

          fixture.detectChanges();
          tick();

          fixture.detectChanges();
          tick();

          const finishBtn = getFinishBtn();

          expect(finishBtn).toBeVisible();
        }));

        it('should default to not being disabled', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 2;

          fixture.detectChanges();
          tick();

          fixture.detectChanges();
          tick();

          const finishBtn = getFinishBtn();

          expect(finishBtn.disabled).toBe(false);
        }));

        it('should reflect disabled input if passed', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 2;
          fixture.componentInstance.finishDisabled = true;

          fixture.detectChanges();
          tick();

          fixture.detectChanges();
          tick();

          const finishBtn = getFinishBtn();

          expect(finishBtn.disabled).toBe(true);
        }));

        it('should submit the form on click', fakeAsync(() => {
          const fixture = TestBed.createComponent(SkyWizardTestFormComponent);
          const saveSpy = jasmine.createSpy().and.stub();

          fixture.componentInstance.renderFinishButton = true;
          fixture.componentInstance.selectedTab = 2;
          fixture.componentInstance.onSave = saveSpy;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          const finishBtn = getFinishBtn();

          finishBtn.click();

          expect(saveSpy).toHaveBeenCalled();
        }));
      });
    });
  });
});
