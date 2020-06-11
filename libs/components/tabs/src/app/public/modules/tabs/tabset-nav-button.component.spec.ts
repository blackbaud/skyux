import {
  async,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import { SkyTabsetNavButtonComponent } from './tabset-nav-button.component';
import { SkyTabsFixturesModule } from './fixtures/tabs-fixtures.module';
import { SkyWizardTestFormComponent } from './fixtures/tabset-wizard.component.fixture';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyTabsFixturesModule
      ]
    });
  });

  it('should set default text based on the button type', () => {
    let fixture = TestBed.createComponent(SkyTabsetNavButtonComponent);

    fixture.componentInstance.buttonType = 'next';

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Next');

    fixture.componentInstance.buttonType = 'previous';

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Previous');
  });

  it('should allow the button text to be overridden', () => {
    let fixture = TestBed.createComponent(SkyTabsetNavButtonComponent);

    fixture.componentInstance.buttonText = 'Foo';

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Foo');
  });

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(SkyTabsetNavButtonComponent);
    fixture.componentInstance.buttonText = 'Foo';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('wizard style', () => {
    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(SkyWizardTestFormComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    describe('previous button', () => {
      it('should navigate to the previous tab when clicked', fakeAsync(() => {
        let fixture = TestBed.createComponent(SkyWizardTestFormComponent);

        fixture.detectChanges();
        tick();

        fixture.componentInstance.selectedTab = 1;

        fixture.detectChanges();
        tick();

        let tabBtns = document.querySelectorAll('.sky-btn-tab-wizard');

        expect(tabBtns[1]).toHaveCssClass('sky-btn-tab-selected');

        let previousBtn = getPreviousBtn();

        previousBtn.click();
        fixture.detectChanges();
        tick();

        expect(tabBtns[0]).toHaveCssClass('sky-btn-tab-selected');
      }));

      it('should be disabled if the first tab is selected', () => {
        let fixture = TestBed.createComponent(SkyWizardTestFormComponent);

        fixture.detectChanges();

        let previousBtn = getPreviousBtn();

        expect(previousBtn.disabled).toBe(true);
      });
    });

    describe('next button', () => {
      it('should navigate to the next tab when clicked', fakeAsync(() => {
        let fixture = TestBed.createComponent(SkyWizardTestFormComponent);

        fixture.detectChanges();
        tick();

        let tabBtns = document.querySelectorAll('.sky-btn-tab-wizard');

        expect(tabBtns[0]).toHaveCssClass('sky-btn-tab-selected');

        let nextBtn = getNextBtn();

        nextBtn.click();
        fixture.detectChanges();
        tick();

        expect(tabBtns[1]).toHaveCssClass('sky-btn-tab-selected');
      }));

      it('should be disabled if the next tab is disabled', () => {
        let fixture = TestBed.createComponent(SkyWizardTestFormComponent);

        fixture.componentInstance.step2Disabled = true;

        fixture.detectChanges();

        let nextBtn = getNextBtn();

        expect(nextBtn.disabled).toBe(true);

        fixture.componentInstance.step2Disabled = false;

        fixture.detectChanges();

        expect(nextBtn.disabled).toBe(false);
      });

      it('should be disabled if the last tab is selected', () => {
        let fixture = TestBed.createComponent(SkyWizardTestFormComponent);

        fixture.componentInstance.selectedTab = 2;

        fixture.detectChanges();

        let nextBtn = getNextBtn();

        expect(nextBtn.disabled).toBe(true);
      });
    });
  });
});
