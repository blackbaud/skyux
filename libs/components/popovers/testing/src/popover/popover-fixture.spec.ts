import { Component } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect, SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyPopoverFixture } from './popover-fixture';

import { SkyPopoverTestingModule } from './popover-testing.module';

//#region Test component
@Component({
  selector: 'sky-popover-test',
  template: `
    <button
      class="sky-btn sky-margin-inline-compact"
      type="button"
      [skyPopover]="myPopover"
      [skyPopoverAlignment]="popoverAlignment"
      [skyPopoverPlacement]="popoverPlacement"
      #directiveRef
    >
      Open popover on click
    </button>

    <sky-popover
      [dismissOnBlur]="dismissOnBlur"
      [popoverTitle]="popoverTitle"
      #myPopover
    >
      {{ popoverBody }}
    </sky-popover>
  `,
})
class PopoverTestComponent {
  public dismissOnBlur: boolean;
  public popoverAlignment: string;
  public popoverBody: string = 'popover body';
  public popoverPlacement: string;
  public popoverTitle: string = 'popover title';
}
//#endregion Test component

describe('Popover fixture', () => {
  let fixture: ComponentFixture<PopoverTestComponent>;
  let testComponent: PopoverTestComponent;
  let popoverFixture: SkyPopoverFixture;

  //#region helpers
  function getPopoverTriggerEl(): HTMLButtonElement {
    return document.querySelector('.sky-btn');
  }

  function openPopover(): Promise<any> {
    expect(popoverFixture.popoverIsVisible).toEqual(false);

    let triggerEl = getPopoverTriggerEl();
    triggerEl.click();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(popoverFixture.popoverIsVisible).toEqual(true);
    });
  }
  //#endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopoverTestComponent],
      imports: [SkyPopoverTestingModule],
    });

    fixture = TestBed.createComponent(PopoverTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    popoverFixture = new SkyPopoverFixture(fixture);
  });

  it('should not expose popover properties when hidden', () => {
    // the popover should be hidden
    expect(popoverFixture.popoverIsVisible).toEqual(false);

    // expect all values to be undefined since the popover element does not exist
    expect(popoverFixture.popoverTitle).toBeUndefined();
    expect(popoverFixture.body).toBeUndefined();
    expect(popoverFixture.alignment).toBeUndefined();
    expect(popoverFixture.placement).toBeUndefined();
  });

  it('should expose popover properties when visible', async () => {
    // give properties non-default values
    testComponent.popoverTitle = 'my title';
    testComponent.popoverBody = 'my popover message';
    testComponent.popoverAlignment = 'left';
    testComponent.popoverPlacement = 'below';
    fixture.detectChanges();

    // the popover is closed initially, we need to open it to check values
    await openPopover();

    // expect the values to match our updates
    expect(popoverFixture.popoverTitle).toEqual(testComponent.popoverTitle);
    expect(SkyAppTestUtility.getText(popoverFixture.body)).toEqual(
      testComponent.popoverBody
    );
    expect(popoverFixture.alignment).toEqual(testComponent.popoverAlignment);
    expect(popoverFixture.placement).toEqual(testComponent.popoverPlacement);
  });

  it('should hide by default when blur is invoked', async () => {
    // open the popover
    await openPopover();

    // blur
    await popoverFixture.blur();
    fixture.detectChanges();

    // expect the popover to be dismissed
    expect(popoverFixture.popoverIsVisible).toEqual(false);
  });

  it('should honor dismissOnBlur flag', async () => {
    // oveerride the dismissOnBlur default
    testComponent.dismissOnBlur = false;
    fixture.detectChanges();

    // open the popover
    await openPopover();

    // blur
    await popoverFixture.blur();
    fixture.detectChanges();

    // expect the popover to remain open
    expect(popoverFixture.popoverIsVisible).toEqual(true);
  });
});
