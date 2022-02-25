import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { Component } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';

import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { SkyTabsModule } from '@skyux/tabs';

import { SkyTabsetFixture } from './tabset-fixture';

//#region Test component
@Component({
  selector: 'sky-tabset-test',
  template: `
    <sky-tabset
      data-sky-id="test-tabset"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [permalinkId]="permalinkId"
      (activeChange)="onActiveChange($event)"
      (newTab)="onNewTab()"
      (openTab)="onOpenTab()"
    >
      <sky-tab
        tabHeading="Tab 1"
        tabHeaderCount="40"
        [active]="true"
        [permalinkValue]="permalinkValueTab1"
        (close)="onTab1Close()"
      >
        Content for Tab 1
      </sky-tab>
      <sky-tab tabHeading="Tab 2"> Content for Tab 2 </sky-tab>
      <sky-tab tabHeading="Tab 3" [disabled]="true">
        Content for Tab 3
      </sky-tab>
    </sky-tabset>
  `,
})
class TestComponent {
  public permalinkId: string;

  public permalinkValueTab1: string;

  public ariaLabel = 'Tabset ARIA label';

  public ariaLabelledBy: string;

  public onActiveChange(): void {}

  public onNewTab(): void {}

  public onOpenTab(): void {}

  public onTab1Close(): void {}
}
//#endregion Test component

describe('Tabset fixture', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [RouterTestingModule, SkyTabsModule],
    });

    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  function validateProperties(): void {
    const tabset = new SkyTabsetFixture(fixture, 'test-tabset');

    // aria-label takes precedence over aria-labelledby, so they can't both be set
    // at the same time; otherwise the DOM reports back that aria-labelledby is
    // not set even though the attribute is specified on the element.
    expect(tabset.ariaLabel).toBe('Tabset ARIA label');
    expect(tabset.ariaLabelledBy).toBe(undefined);

    fixture.componentInstance.ariaLabel = undefined;
    fixture.componentInstance.ariaLabelledBy = 'Labelled by';

    fixture.detectChanges();

    expect(tabset.ariaLabelledBy).toBe('Labelled by');
  }

  async function validateTabProperties(): Promise<void> {
    fixture.componentInstance.permalinkId = 'test-tab';
    fixture.componentInstance.permalinkValueTab1 = 'tab-1';

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const tabset = new SkyTabsetFixture(fixture, 'test-tabset');

    expect(tabset.getTab(0)).toEqual({
      active: true,
      disabled: false,
      permalinkValue: 'tab-1',
      tabHeaderCount: '40',
      tabHeading: 'Tab 1',
    });

    expect(tabset.getTab(1)).toEqual({
      active: false,
      disabled: false,
      permalinkValue: 'tab-2',
      tabHeaderCount: undefined,
      tabHeading: 'Tab 2',
    });

    expect(tabset.getTab(2)).toEqual({
      active: false,
      disabled: true,
      permalinkValue: undefined,
      tabHeaderCount: undefined,
      tabHeading: 'Tab 3',
    });
  }

  function validateNewTabClick(): void {
    const tabset = new SkyTabsetFixture(fixture, 'test-tabset');

    const onNewTabSpy = spyOn(fixture.componentInstance, 'onNewTab');

    tabset.clickNewButton();

    expect(onNewTabSpy).toHaveBeenCalled();
  }

  function validateOpenTabClick(): void {
    const tabset = new SkyTabsetFixture(fixture, 'test-tabset');

    const onOpenTabSpy = spyOn(fixture.componentInstance, 'onOpenTab');

    tabset.clickOpenButton();

    expect(onOpenTabSpy).toHaveBeenCalled();
  }

  async function validateTabClick(): Promise<void> {
    const tabset = new SkyTabsetFixture(fixture, 'test-tabset');

    const onActiveChangeSpy = spyOn(
      fixture.componentInstance,
      'onActiveChange'
    );

    fixture.detectChanges();
    await fixture.whenStable();

    await tabset.clickTab(1);

    expect(tabset.activeTabIndex).toBe(1);

    expect(onActiveChangeSpy).toHaveBeenCalledWith(1);

    expect(
      fixture.debugElement.queryAll(By.css('.sky-tabset-tabs .sky-btn-tab'))[1]
        .nativeElement
    ).toHaveCssClass('sky-btn-tab-selected');

    let errorMessage: string;

    try {
      await tabset.clickTab(100);
    } catch (err) {
      errorMessage = err.message;
    }

    expect(errorMessage).toBe('There is no tab at index 100.');
  }

  async function validateTabClose(): Promise<void> {
    const tabset = new SkyTabsetFixture(fixture, 'test-tabset');

    const onTab1CloseSpy = spyOn(fixture.componentInstance, 'onTab1Close');

    fixture.detectChanges();
    await fixture.whenStable();

    await tabset.clickTabClose(0);

    expect(onTab1CloseSpy).toHaveBeenCalled();

    let errorMessage: string;

    try {
      await tabset.clickTabClose(1);
    } catch (err) {
      errorMessage = err.message;
    }

    expect(errorMessage).toBe(
      'The specified tab does not have a close button.'
    );
  }

  it('should expose the expected properties', () => {
    validateProperties();
  });

  it('should expose the expected properties of a tab', async () => {
    await validateTabProperties();
  });

  it('should allow the new tab button to be clicked', () => {
    validateNewTabClick();
  });

  it('should allow the open tab button to be clicked', () => {
    validateOpenTabClick();
  });

  it('should allow a tab to be clicked', async () => {
    await validateTabClick();
  });

  it('should allow a tab to be closed', async () => {
    await validateTabClose();
  });

  describe('when collapsed to dropdown tab', () => {
    beforeEach(async () => {
      function fireResizeEvent() {
        SkyAppTestUtility.fireDomEvent(window, 'resize');
        fixture.detectChanges();
      }

      fixture.detectChanges();
      await fixture.whenStable();

      let el = fixture.nativeElement;
      el.style.width =
        el.querySelector('.sky-tabset-tabs').offsetWidth - 1 + 'px';

      fireResizeEvent();
    });

    it('should expose the expected properties', () => {
      validateProperties();
    });

    it('should expose the expected properties of a tab', async () => {
      await validateTabProperties();
    });

    it('should allow the new tab button to be clicked', () => {
      validateNewTabClick();
    });

    it('should allow the open tab button to be clicked', () => {
      validateOpenTabClick();
    });

    it('should allow a tab to be clicked', async () => {
      await validateTabClick();
    });

    it('should allow a tab to be closed', async () => {
      await validateTabClose();
    });
  });
});
