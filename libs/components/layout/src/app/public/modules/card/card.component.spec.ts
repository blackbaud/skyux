import {
  TestBed, async
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import { SkyCardFixturesModule } from './fixtures/card-fixtures.module';
import { CardTestComponent } from './fixtures/card.component.fixture';

function validateCardSelected(cmp: CardTestComponent, cardEl: any, selected: boolean) {
  let selectedEl = cardEl.querySelector('.sky-card.sky-card-selected');

  if (selected) {
    expect(cmp.cardSelected).toBe(true);
    expect(selectedEl).not.toBeNull();
  } else {
    expect(cmp.cardSelected).toBe(false);
    expect(selectedEl).toBeNull();
  }
}

describe('Card component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyCardFixturesModule
      ]
    });
  });

  it('should place the individual components in their respective placeholders', () => {
    let html = `
      <sky-card>
        <sky-card-title>Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
        <sky-card-actions>
          <button type="button" class="btn btn-default">Button</button>
        </sky-card-actions>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    expect(el.querySelector('.sky-card-title sky-card-title')).toHaveText('Title');
    expect(el.querySelector('.sky-card-content sky-card-content')).toHaveText('Content');
    expect(el.querySelector('.sky-card-actions button')).toHaveText('Button');
  });

  it('should add the appropriate CSS class for small cards', () => {
    let html = `
      <sky-card [size]="'small'">
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    expect(el.querySelector('section.sky-card')).toHaveCssClass('sky-card-small');
  });

  it('should display a checkbox when the selectable attribute is set to true', () => {
    let html = `
      <sky-card [selectable]="'true'">
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    let wrapperEl = el.querySelector(
      '.sky-card.sky-card-selectable .sky-card-header .sky-card-check .sky-checkbox-wrapper'
    );

    expect(wrapperEl).not.toBeNull();
  });

  it('should allow the user to click the entire card to select the card', () => {
    let html = `
      <sky-card
          [selectable]="showCheckbox"
          [(selected)]="cardSelected"
      >
        <sky-card-title>Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);

    let cmp = fixture.componentInstance as CardTestComponent,
      el = fixture.nativeElement;

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    el.querySelector('.sky-card-content').click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, true);

    el.querySelector('.sky-card-header').click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    let labelEl = <HTMLLabelElement>el
        .querySelector('label.sky-checkbox-wrapper');

    labelEl.click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, true);

  });

  it('should not allow clicking the card to select it when it is not selectable', () => {
    let html = `
      <sky-card
          [selectable]="showCheckbox"
          [(selected)]="cardSelected"
      >
        <sky-card-title>Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);

    let cmp = fixture.componentInstance as CardTestComponent,
      el = fixture.nativeElement;

    cmp.showCheckbox = false;
    fixture.detectChanges();

    validateCardSelected(cmp, el, false);

    el.querySelector('.sky-card-content').click();

    fixture.detectChanges();

    validateCardSelected(cmp, el, false);
  });

  it('should hide the header properly when title is removed', () => {
    let html = `
      <sky-card
          [selectable]="showCheckbox"
          [(selected)]="cardSelected"
      >
        <sky-card-title *ngIf="showTitle">Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);

    let cmp = fixture.componentInstance as CardTestComponent,
      el = fixture.nativeElement;

    fixture.detectChanges();

    cmp.showTitle = false;
    cmp.showCheckbox = false;
    fixture.detectChanges();

    expect(el.querySelector('.sky-card-header')).toBeNull();
  });

  it('should be accessible when standard', async(() => {
    let html = `
      <sky-card>
        <sky-card-title>Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
        <sky-card-actions>
          <button type="button" class="btn btn-default">Button</button>
        </sky-card-actions>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should be accessible when selectable', async(() => {
    let html = `
      <sky-card
          [selectable]="showCheckbox"
          [(selected)]="cardSelected"
      >
        <sky-card-title>Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should be accessible when title is removed', async(() => {
    let html = `
      <sky-card
          [selectable]="showCheckbox"
          [(selected)]="cardSelected"
      >
        <sky-card-title *ngIf="showTitle">Title</sky-card-title>
        <sky-card-content>Content</sky-card-content>
      </sky-card>
    `;

    let fixture = TestBed
      .overrideComponent(
        CardTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(CardTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
