import { TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';

import { SkyCardModule } from '@skyux/layout';

import { SkyCardFixture } from './card-fixture';

//#region Test component
@Component({
  selector: 'sky-card-test',
  template: `
    <sky-card
      [size]="size"
      [selectable]="showCheckbox"
      [(selected)]="selected"
      data-sky-id="test-card"
    >
      <sky-card-title *ngIf="showTitle">Card title</sky-card-title>
      <sky-card-content *ngIf="showContent"> Card content </sky-card-content>
      <sky-card-actions *ngIf="showAction">
        <button class="sky-btn sky-btn-default">Click me</button>
      </sky-card-actions>
    </sky-card>
  `,
})
class TestComponent {
  public selected = false;

  public showAction = true;

  public showCheckbox = true;

  public showContent = true;

  public showTitle = true;

  public size = 'large';
}
//#endregion Test component

describe('Action button fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyCardModule],
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const card = new SkyCardFixture(fixture, 'test-card');

    expect(card.titleText).toBe('Card title');
    expect(card.contentText).toBe('Card content');
    expect(card.selectable).toBe(true);
  });

  it('should provide a method for selecting the card', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.selected).toBe(false);

    const card = new SkyCardFixture(fixture, 'test-card');

    const validateSelected = (selected: boolean) => {
      expect(card.selected).toBe(selected);
      expect(fixture.componentInstance.selected).toBe(selected);
    };

    card.select();
    validateSelected(true);

    card.select();
    validateSelected(true);

    card.deselect();
    validateSelected(false);

    card.deselect();
    validateSelected(false);
  });

  it('should throw an error when selecting a card that is not selectable', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.componentInstance.showCheckbox = false;

    fixture.detectChanges();

    const card = new SkyCardFixture(fixture, 'test-card');

    expect(() => card.select()).toThrowError('The card is not selectable.');
  });
});
