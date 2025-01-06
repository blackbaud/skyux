import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

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

    <sky-popover [popoverTitle]="popoverTitle" #myPopover>
      {{ popoverBody }}
    </sky-popover>
  `,
  standalone: false,
})
class PopoverTestComponent {
  public popoverAlignment: string | undefined;
  public popoverBody = 'popover body';
  public popoverPlacement: string | undefined;
  public popoverTitle = 'popover title';
}
//#endregion Test component

describe('Popover fixture', () => {
  let fixture: ComponentFixture<PopoverTestComponent>;
  let testComponent: PopoverTestComponent;
  let popoverFixture: SkyPopoverFixture;

  //#region helpers
  function getPopoverTriggerEl(): HTMLButtonElement | null {
    return document.querySelector('.sky-btn');
  }

  async function openPopover(): Promise<void> {
    expect(popoverFixture.popoverIsVisible).toEqual(false);

    const triggerEl = getPopoverTriggerEl();
    triggerEl?.click();
    fixture.detectChanges();

    await fixture.whenStable();
    expect(popoverFixture.popoverIsVisible).toEqual(true);
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
      testComponent.popoverBody,
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
});
