import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyIconModule
} from './icon.module';

import {
  IconTestComponent
} from './fixtures/icon.component.fixture';

describe('Icon component', () => {
  let fixture: ComponentFixture<IconTestComponent>;
  let cmp: IconTestComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        IconTestComponent
      ],
      imports: [
        SkyIconModule
      ]
    });

    fixture = TestBed.createComponent(IconTestComponent);
    cmp = fixture.componentInstance as IconTestComponent;
    element = fixture.nativeElement as HTMLElement;
  });

  it('should display an icon based on the given icon', async(() => {
    fixture.detectChanges();
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-circle');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-3x');
    expect(element.querySelector('.sky-icon')).not.toHaveCssClass('fa-fw');
    expect(element.querySelector('.sky-icon').getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('.sky-icon').classList.length).toBe(4);

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should display a different icon with a different size and a fixedWidth', () => {
    cmp.icon = 'broom';
    cmp.size = '5x';
    cmp.fixedWidth = true;
    fixture.detectChanges();

    expect(cmp.icon).toBe('broom');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-broom');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-5x');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-fw');
    expect(element.querySelector('.sky-icon').classList.length).toBe(5);
    expect(element.querySelector('.sky-icon').getAttribute('aria-hidden')).toBe('true');
  });

  it('should show an icon without optional inputs', () => {
    cmp.icon = 'spinner';
    cmp.size = undefined;
    cmp.fixedWidth = undefined;
    fixture.detectChanges();

    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-spinner');
    expect(element.querySelector('.sky-icon').classList.length).toBe(3);
  });
});
