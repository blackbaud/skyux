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
  IconStackTestComponent
} from './fixtures/icon-stack.component.fixture';

describe('Icon stack component', () => {
  let fixture: ComponentFixture<IconStackTestComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        IconStackTestComponent
      ],
      imports: [
        SkyIconModule
      ]
    });

    fixture = TestBed.createComponent(IconStackTestComponent);

    element = fixture.nativeElement;
  });

  it('should display an icon stack based on the given icons', async(() => {
    fixture.detectChanges();

    const wrapperEl = element.querySelector('span');

    expect(wrapperEl).toHaveCssClass('fa-stack');
    expect(wrapperEl).toHaveCssClass('fa-3x');

    const iconEls = element.querySelectorAll('.sky-icon');

    const baseIconEl = iconEls[0];
    const topIconEl = iconEls[1];

    expect(baseIconEl).toHaveCssClass('fa-circle');
    expect(baseIconEl).toHaveCssClass('fa-stack-2x');

    expect(topIconEl).toHaveCssClass('fa-bell');
    expect(topIconEl).toHaveCssClass('fa-stack-1x');
    expect(topIconEl).toHaveCssClass('fa-inverse');

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
