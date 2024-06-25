import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyIconFixturesModule } from './fixtures/icon-fixtures.module';
import { IconStackTestComponent } from './fixtures/icon-stack.component.fixture';
import { SkyIconStackItem } from './icon-stack-item';

describe('Icon stack component', () => {
  function setupIcon(
    baseIcon: SkyIconStackItem,
    topIcon: SkyIconStackItem,
    size?: string,
  ): void {
    cmp.baseIcon = baseIcon;
    cmp.topIcon = topIcon;
    cmp.size = size;

    fixture.detectChanges();
  }

  let fixture: ComponentFixture<IconStackTestComponent>;
  let cmp: IconStackTestComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyIconFixturesModule],
    });

    fixture = TestBed.createComponent(IconStackTestComponent);
    cmp = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should display an icon stack based on the given icons', async () => {
    setupIcon({ icon: 'circle' }, { icon: 'bell-solid' }, '3x');

    const wrapperEl = element.querySelector('span');

    expect(wrapperEl).toHaveCssClass('fa-stack');
    expect(wrapperEl).toHaveCssClass('fa-3x');
    expect(wrapperEl).toHaveCssClass('sky-icon-stack-size-3x');

    const iconEls = element.querySelectorAll('.sky-icon');

    const baseIconEl = iconEls[0];
    const topIconEl = iconEls[1];

    expect(baseIconEl).toHaveCssClass('fa-circle');
    expect(baseIconEl).toHaveCssClass('fa-stack-2x');

    expect(topIconEl).toHaveCssClass('fa-bell');
    expect(topIconEl).toHaveCssClass('fa-stack-1x');
    expect(topIconEl).toHaveCssClass('fa-inverse');
  });

  describe('a11y', () => {
    it('should be accessible (baseIcon: "circle", topIcon: "bell", size: undefined', async () => {
      setupIcon({ icon: 'circle' }, { icon: 'bell' });

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (baseIcon: "circle", topIcon: "bell", size: "3x"', async () => {
      setupIcon({ icon: 'circle' }, { icon: 'bell' }, '3x');
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
