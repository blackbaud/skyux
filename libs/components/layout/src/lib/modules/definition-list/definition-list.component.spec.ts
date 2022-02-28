import { TestBed, async } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyDefinitionListFixturesModule } from './fixtures/definition-list-fixtures.module';
import { SkyDefinitionListTestComponent } from './fixtures/definition-list.component.fixture';

describe('Definition list component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyDefinitionListFixturesModule],
    });
  });

  function getListEl(el: Element, listIndex: number): Element {
    return el.querySelector('.sky-definition-list-test-' + listIndex);
  }

  function getLabelEls(listEl: Element): NodeListOf<Element> {
    return listEl.querySelectorAll(
      'sky-definition-list-label .sky-definition-list-label'
    );
  }

  function getValueEls(listEl: Element): NodeListOf<Element> {
    return listEl.querySelectorAll(
      'sky-definition-list-value .sky-definition-list-value'
    );
  }

  function getDefaultValueEl(valueEl: Element): Element {
    return valueEl.querySelector('.sky-deemphasized');
  }

  it('should render the heading in the expected location', () => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    let el: Element = fixture.nativeElement;

    fixture.detectChanges();

    let list1El = getListEl(el, 1);

    let headingEl = list1El.querySelector(
      'sky-definition-list-heading .sky-definition-list-heading'
    );

    expect(headingEl).toHaveText('Personal information');
    expect(headingEl).toHaveCssClass('sky-subsection-heading');
  });

  it('should render labels and values in the expected locations', () => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    let el: Element = fixture.nativeElement;

    fixture.detectChanges();

    let list1El = getListEl(el, 1);

    let labelEls = getLabelEls(list1El);
    let valueEls = getValueEls(list1El);

    expect(labelEls[0]).toHaveCssClass('sky-field-label');
    expect(labelEls[0]).toHaveText('Job title');

    expect(valueEls[0]).toHaveText('Engineer');
  });

  it('should display a default value when no value is specified', () => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    let el: Element = fixture.nativeElement;

    fixture.detectChanges();

    let list1El = getListEl(el, 1);

    let valueEls = getValueEls(list1El);

    let defaultValueEl = valueEls[2].querySelector('.sky-deemphasized');

    expect(defaultValueEl).toHaveText('None found.');
  });

  it('should display a subsequent value when no value is initially specified', () => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    let el: Element = fixture.nativeElement;

    fixture.detectChanges();

    let list1El = getListEl(el, 1);

    let valueEls = getValueEls(list1El);

    let defaultValueEl = getDefaultValueEl(valueEls[2]);

    expect(defaultValueEl).toHaveText('None found.');

    fixture.componentInstance.personalInfo[2].value = 'test';

    fixture.detectChanges();

    defaultValueEl = getDefaultValueEl(valueEls[2]);

    expect(defaultValueEl).toBeNull();

    expect(valueEls[2]).toHaveText('test');
  });

  it('should allow the default value to be specified', () => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    let el: Element = fixture.nativeElement;

    fixture.detectChanges();

    let list1El = getListEl(el, 2);

    let valueEls = getValueEls(list1El);

    expect(valueEls[2]).toHaveText('No information found');
  });

  it('should allow the label width to be specified', () => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    let el: Element = fixture.nativeElement;

    fixture.detectChanges();

    let list1El = getListEl(el, 2);

    let labelEls = getLabelEls(list1El);

    expect(getComputedStyle(labelEls[0]).width).toBe('150px');
  });

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(SkyDefinitionListTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
