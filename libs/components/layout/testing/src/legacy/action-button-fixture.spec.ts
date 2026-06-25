import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyActionButtonModule } from '@skyux/layout';

import { SkyActionButtonFixture } from './action-button-fixture';

//#region Test component
@Component({
  selector: 'sky-action-button-test',
  template: `
    <sky-action-button
      (actionClick)="filterActionClick()"
      data-sky-id="filter-button"
    >
      @if (iconName) {
        <sky-action-button-icon [iconName]="iconName"></sky-action-button-icon>
      }
      <sky-action-button-header> Build a new list </sky-action-button-header>
      <sky-action-button-details>
        Start from scratch and fine-tune with filters
      </sky-action-button-details>
    </sky-action-button>
  `,
  standalone: false,
})
class TestComponent {
  public iconName: string | undefined = 'filter';

  public filterActionClick(): void {
    return;
  }
}
//#endregion Test component

describe('Action button fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyActionButtonModule],
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const actionButton = new SkyActionButtonFixture(fixture, 'filter-button');

    expect(actionButton.headerText).toBe('Build a new list');
    expect(actionButton.detailsText).toBe(
      'Start from scratch and fine-tune with filters',
    );
    expect(actionButton.iconType).toBe('filter');
  });

  it('should expose the expected properties (no icon)', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.iconName = undefined;

    fixture.detectChanges();

    const actionButton = new SkyActionButtonFixture(fixture, 'filter-button');

    expect(actionButton.headerText).toBe('Build a new list');
    expect(actionButton.detailsText).toBe(
      'Start from scratch and fine-tune with filters',
    );
    expect(actionButton.iconType).toBeUndefined();
  });

  it('should provide methods for invoking events', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const actionButton = new SkyActionButtonFixture(fixture, 'filter-button');

    const filterActionClickSpy = spyOn(
      fixture.componentInstance,
      'filterActionClick',
    );

    actionButton.actionClick();

    expect(filterActionClickSpy).toHaveBeenCalled();
  });
});
