import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { CardTestComponent } from './fixtures/card.component.fixture';

import { SkyCardFixturesModule } from './fixtures/card-fixtures.module';

import { SkyInlineDeleteType } from '../inline-delete/inline-delete-type';

function validateCardSelected(
  cmp: CardTestComponent,
  cardEl: any,
  selected: boolean
) {
  const selectedEl = cardEl.querySelector('.sky-card.sky-card-selected');

  if (selected) {
    expect(cmp.cardSelected).toBe(true);
    expect(selectedEl).not.toBeNull();
  } else {
    expect(cmp.cardSelected).toBe(false);
    expect(selectedEl).toBeNull();
  }
}

describe('Card component', () => {
  let fixture: ComponentFixture<CardTestComponent>;
  let cmp: CardTestComponent;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyCardFixturesModule],
    });

    fixture = TestBed.createComponent(CardTestComponent);
    cmp = fixture.componentInstance;
    el = fixture.nativeElement;
  });

  it('should place the individual components in their respective placeholders', () => {
    cmp.showActions = true;

    fixture.detectChanges();

    expect(el.querySelector('.sky-card-title sky-card-title')).toHaveText(
      'Title'
    );
    expect(el.querySelector('.sky-card-content sky-card-content')).toHaveText(
      'Content'
    );
    expect(el.querySelector('.sky-card-actions button')).toHaveText('Button');
  });

  it('should add the appropriate CSS class for small cards', () => {
    cmp.cardSize = 'small';

    fixture.detectChanges();

    expect(el.querySelector('section.sky-card')).toHaveCssClass(
      'sky-card-small'
    );
  });

  it('should display a checkbox when the selectable attribute is set to true', () => {
    fixture.detectChanges();

    const wrapperEl = el.querySelector(
      '.sky-card.sky-card-selectable .sky-card-header .sky-card-check .sky-checkbox-wrapper'
    );

    expect(wrapperEl).not.toBeNull();
  });

  it('should allow the user to click the entire card to select the card', () => {
    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    (<HTMLElement>el.querySelector('.sky-card-content')).click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, true);

    (<HTMLElement>el.querySelector('.sky-card-header')).click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    const labelEl = <HTMLLabelElement>(
      el.querySelector('label.sky-checkbox-wrapper')
    );

    labelEl.click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, true);
  });

  it('should only emit the selectedChange event if the checkbox changes to a new value', () => {
    cmp.cardSelected = true;

    fixture.detectChanges();

    const emmitterSpy = spyOn(
      cmp.card.selectedChange,
      'emit'
    ).and.callThrough();

    validateCardSelected(cmp, el, true);

    cmp.card.onCheckboxChange(true);

    fixture.detectChanges();

    validateCardSelected(cmp, el, true);

    cmp.card.onCheckboxChange(false);

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    expect(emmitterSpy).toHaveBeenCalledTimes(1);
  });

  it('should not allow clicking the card to select it when it is not selectable', () => {
    cmp.showCheckbox = false;
    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    (<HTMLElement>el.querySelector('.sky-card-content')).click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);
  });

  it('should not allow a call to the onCheckboxChange function to select it when it is not selectable', () => {
    cmp.showCheckbox = false;
    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    const emmitterSpy = spyOn(
      cmp.card.selectedChange,
      'emit'
    ).and.callThrough();

    cmp.card.onCheckboxChange(true);

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    expect(emmitterSpy).not.toHaveBeenCalled();
  });

  it('should hide the header properly when title is removed', () => {
    fixture.detectChanges();

    cmp.showTitle = false;
    cmp.showCheckbox = false;
    fixture.detectChanges();

    expect(el.querySelector('.sky-card-header')).toBeNull();
  });

  it('should be accessible when not selectable', async(() => {
    cmp.showCheckbox = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should be accessible when selectable', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should be accessible when title is removed', async(() => {
    cmp.showTitle = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should set the inline delete to the card style when initially added', async(() => {
    cmp.showDelete = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('sky-inline-delete')).not.toBeNull();
      expect(cmp.card.inlineDeleteComponent.length).toBe(1);
      expect(cmp.card.inlineDeleteComponent.first.type).toBe(
        SkyInlineDeleteType.Card
      );
    });
  }));

  it('should set the inline delete to the card style when dynamically added', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('sky-inline-delete')).toBeNull();
      expect(cmp.card.inlineDeleteComponent.length).toBe(0);

      cmp.showDelete = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(el.querySelector('sky-inline-delete')).not.toBeNull();
        expect(cmp.card.inlineDeleteComponent.length).toBe(1);
        expect(cmp.card.inlineDeleteComponent.first.type).toBe(
          SkyInlineDeleteType.Card
        );
      });
    });
  }));
});
