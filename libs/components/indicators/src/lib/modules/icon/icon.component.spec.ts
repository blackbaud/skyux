import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyIconFixturesModule } from './fixtures/icon-fixtures.module';
import { IconTestComponent } from './fixtures/icon.component.fixture';
import { SkyIconResolverService } from './icon-resolver.service';
import { SkyIconType } from './types/icon-type';
import { SkyIconVariantType } from './types/icon-variant-type';

describe('Icon component', () => {
  function setupIcon(
    icon: string,
    iconType?: SkyIconType,
    size?: string,
    fixedWidth?: boolean,
    variant?: SkyIconVariantType
  ): void {
    cmp.icon = icon;
    cmp.iconType = iconType;
    cmp.size = size;
    cmp.fixedWidth = fixedWidth;
    cmp.variant = variant;

    fixture.detectChanges();
  }

  let fixture: ComponentFixture<IconTestComponent>;
  let cmp: IconTestComponent;
  let element: HTMLElement;
  let mockResolver: jasmine.SpyObj<SkyIconResolverService>;

  beforeEach(() => {
    mockResolver = jasmine.createSpyObj('mockResolver', ['resolveIcon']);

    mockResolver.resolveIcon.and.callFake((iconName, variant) => {
      if (iconName === 'variant-test') {
        return 'variant-test-' + variant;
      }

      return iconName;
    });

    TestBed.configureTestingModule({
      imports: [SkyIconFixturesModule],
      providers: [
        {
          provide: SkyIconResolverService,
          useValue: mockResolver,
        },
      ],
    });

    fixture = TestBed.createComponent(IconTestComponent);
    cmp = fixture.componentInstance as IconTestComponent;
    element = fixture.nativeElement as HTMLElement;
  });

  it('should display an icon based on the given icon', async () => {
    fixture.detectChanges();
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-circle');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-3x');
    expect(element.querySelector('.sky-icon')).not.toHaveCssClass('fa-fw');
    expect(
      element.querySelector('.sky-icon')?.getAttribute('aria-hidden')
    ).toBe('true');
    expect(element.querySelector('.sky-icon')?.classList.length).toBe(4);
  });

  it('should display a different icon with a different size and a fixedWidth', () => {
    setupIcon('broom', undefined, '5x', true);

    expect(cmp.icon).toBe('broom');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-broom');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-5x');
    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-fw');
    expect(element.querySelector('.sky-icon')?.classList.length).toBe(5);
    expect(
      element.querySelector('.sky-icon')?.getAttribute('aria-hidden')
    ).toBe('true');
  });

  it('should show an icon without optional inputs', () => {
    setupIcon('spinner', undefined, undefined, undefined, undefined);

    expect(element.querySelector('.sky-icon')).toHaveCssClass('fa-spinner');
    expect(element.querySelector('.sky-icon')?.classList.length).toBe(3);
  });

  it('should display the specified variant', () => {
    setupIcon('variant-test', 'skyux', undefined, undefined, 'solid');

    expect(element.querySelector('.sky-icon')).toHaveCssClass(
      'sky-i-variant-test-solid'
    );
  });

  describe('a11y', () => {
    it('should be accessible (icon: "close", iconType: undefined, size: undefined, fixedWidth: undefined/false, variant: undefined)', async () => {
      setupIcon('close', undefined, undefined, undefined, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "fa", size: undefined, fixedWidth: undefined/false, variant: undefined)', async () => {
      setupIcon('spinner', 'fa', undefined, undefined, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "skyux", size: undefined, fixedWidth: undefined/false, variant: undefined)', async () => {
      setupIcon('close', 'skyux', undefined, undefined, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: undefined, size: "3x", fixedWidth: undefined/false, variant: undefined)', async () => {
      setupIcon('close', undefined, '3x', undefined, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "fa", size: "3x", fixedWidth: undefined/false, variant: undefined)', async () => {
      setupIcon('close', 'fa', '3x', undefined, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "skyux", size: "3x", fixedWidth: undefined/false, variant: undefined)', async () => {
      setupIcon('close', 'skyux', '3x', undefined, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: undefined, size: undefined, fixedWidth: true, variant: undefined)', async () => {
      setupIcon('close', undefined, undefined, true, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "fa", size: undefined, fixedWidth: true, variant: undefined)', async () => {
      setupIcon('close', 'fa', undefined, true, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "skyux", size: undefined, fixedWidth: true, variant: undefined)', async () => {
      setupIcon('close', 'skyux', undefined, true, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: undefined, size: "3x", fixedWidth: true, variant: undefined)', async () => {
      setupIcon('close', undefined, '3x', true, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "fa", size: "3x", fixedWidth: true, variant: undefined)', async () => {
      setupIcon('close', 'fa', '3x', true, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "skyux", size: "3x", fixedWidth: true, variant: undefined)', async () => {
      setupIcon('close', 'skyux', '3x', true, undefined);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: undefined, fixedWidth: undefined/false, variant: "solid")', async () => {
      setupIcon('info-circle', undefined, undefined, undefined, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: undefined, fixedWidth: undefined/false, variant: "solid")', async () => {
      setupIcon('info-circle', 'fa', undefined, undefined, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "notification", iconType: "skyux", size: undefined, fixedWidth: undefined/false, variant: "solid")', async () => {
      setupIcon('notification', 'skyux', undefined, undefined, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: "3x", fixedWidth: undefined/false, variant: "solid")', async () => {
      setupIcon('info-circle', undefined, '3x', undefined, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: "3x", fixedWidth: undefined/false, variant: "solid")', async () => {
      setupIcon('info-circle', 'fa', '3x', undefined, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "notification", iconType: "skyux", size: "3x", fixedWidth: undefined/false, variant: "solid")', async () => {
      setupIcon('notification', 'skyux', '3x', undefined, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: undefined, fixedWidth: true, variant: "solid")', async () => {
      setupIcon('info-circle', undefined, undefined, true, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: undefined, fixedWidth: true, variant: "solid")', async () => {
      setupIcon('info-circle', 'fa', undefined, true, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "skyux", size: undefined, fixedWidth: true, variant: "solid")', async () => {
      setupIcon('notification', 'skyux', undefined, true, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: "3x", fixedWidth: true, variant: "solid")', async () => {
      setupIcon('info-circle', undefined, '3x', true, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: "3x", fixedWidth: true, variant: "solid")', async () => {
      setupIcon('info-circle', 'fa', '3x', true, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "notification", iconType: "skyux", size: "3x", fixedWidth: true, variant: "solid")', async () => {
      setupIcon('notification', 'skyux', '3x', true, 'solid');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: undefined, fixedWidth: undefined/false, variant: "line")', async () => {
      setupIcon('info-circle', undefined, undefined, undefined, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: undefined, fixedWidth: undefined/false, variant: "line")', async () => {
      setupIcon('info-circle', 'fa', undefined, undefined, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "notification", iconType: "skyux", size: undefined, fixedWidth: undefined/false, variant: "line")', async () => {
      setupIcon('notification', 'skyux', undefined, undefined, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: "3x", fixedWidth: undefined/false, variant: "line")', async () => {
      setupIcon('info-circle', undefined, '3x', undefined, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: "3x", fixedWidth: undefined/false, variant: "line")', async () => {
      setupIcon('info-circle', 'fa', '3x', undefined, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "notification", iconType: "skyux", size: "3x", fixedWidth: undefined/false, variant: "line")', async () => {
      setupIcon('notification', 'skyux', '3x', undefined, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: undefined, fixedWidth: true, variant: "line")', async () => {
      setupIcon('info-circle', undefined, undefined, true, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: undefined, fixedWidth: true, variant: "line")', async () => {
      setupIcon('info-circle', 'fa', undefined, true, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "close", iconType: "skyux", size: undefined, fixedWidth: true, variant: "line")', async () => {
      setupIcon('notification', 'skyux', undefined, true, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: undefined, size: "3x", fixedWidth: true, variant: "line")', async () => {
      setupIcon('info-circle', undefined, '3x', true, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "info-circle", iconType: "fa", size: "3x", fixedWidth: true, variant: "line")', async () => {
      setupIcon('info-circle', 'fa', '3x', true, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "notification", iconType: "skyux", size: "3x", fixedWidth: true, variant: "line")', async () => {
      setupIcon('notification', 'skyux', '3x', true, 'line');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
