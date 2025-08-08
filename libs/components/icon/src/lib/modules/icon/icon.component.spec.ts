import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyIconFixturesModule } from './fixtures/icon-fixtures.module';
import { IconTestComponent } from './fixtures/icon.component.fixture';
import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconSize } from './types/icon-size';
import { SkyIconVariantType } from './types/icon-variant-type';

describe('Icon component', () => {
  let fixture: ComponentFixture<IconTestComponent>;
  let cmp: IconTestComponent;

  describe('iconName', () => {
    let resolverSvc: jasmine.SpyObj<SkyIconSvgResolverService>;

    function detectUrlChanges(): void {
      fixture.detectChanges();

      // Resolve icon ID Observable and apply changes.
      tick();
      fixture.detectChanges();
    }

    function getSvgEl(): SVGElement {
      return fixture.nativeElement.querySelector('.sky-icon-svg-img');
    }

    function setupIcon(
      iconName: string,
      iconSize?: SkyIconSize,
      variant?: SkyIconVariantType,
    ): void {
      cmp.iconName = iconName;
      cmp.iconSize = iconSize;
      cmp.variant = variant;

      fixture.detectChanges();
    }

    function validateIconId(expectedId: string): void {
      const useEl = getSvgEl().querySelector<SVGUseElement>('use');

      expect(useEl?.href.baseVal).toBe(expectedId);
    }

    beforeEach(() => {
      resolverSvc = jasmine.createSpyObj<SkyIconSvgResolverService>(
        'SkyIconSvgResolverService',
        ['resolveHref'],
      );

      resolverSvc.resolveHref.and.callFake((src, size, variant) => {
        return Promise.resolve(`#${src}-${size}-${variant ?? 'line'}`);
      });

      TestBed.configureTestingModule({
        imports: [SkyIconFixturesModule],
        providers: [
          {
            provide: SkyIconSvgResolverService,
            useValue: resolverSvc,
          },
        ],
      });

      fixture = TestBed.createComponent(IconTestComponent);
      cmp = fixture.componentInstance;
    });

    it('should display the resolved icon by ID', fakeAsync(() => {
      setupIcon('test', undefined, undefined, undefined);
      detectUrlChanges();

      validateIconId('#test-20-line');
    }));

    it('should display the resolved icon by ID and size', fakeAsync(() => {
      setupIcon('test', '2x', undefined, undefined);
      detectUrlChanges();

      validateIconId('#test-32-line');
    }));

    it('should display the resolved icon by ID and iconSize', fakeAsync(() => {
      setupIcon('test', undefined, 'l', undefined);
      detectUrlChanges();

      validateIconId('#test-24-line');
    }));

    it('should display the resolved icon by ID and variant', fakeAsync(() => {
      setupIcon('test', undefined, undefined, 'solid');
      detectUrlChanges();

      validateIconId('#test-20-solid');
    }));

    it('should display the resolved icon by ID, size, and variant', fakeAsync(() => {
      setupIcon('test', '2x', undefined, 'solid');
      detectUrlChanges();

      validateIconId('#test-32-solid');
    }));

    it('should display the resolved icon by ID, iconSize, and variant', fakeAsync(() => {
      setupIcon('test', undefined, 'm', 'solid');
      detectUrlChanges();

      validateIconId('#test-20-solid');
    }));

    describe('a11y', () => {
      it('should be accessible (iconName: "test", iconSize: undefined, variant: undefined)', async () => {
        setupIcon('test', undefined, undefined);

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (iconName: "test", iconSize: "s", variant: undefined)', async () => {
        setupIcon('test', 's', undefined);

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (iconName: "test", iconSize: undefined, variant: "solid")', async () => {
        setupIcon('test', undefined, 'solid');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (iconName: "test", iconSize: undefined, variant: "line")', async () => {
        setupIcon('test', undefined, 'line');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (iconName: "test", iconSize: "xl", variant: "solid")', async () => {
        setupIcon('test', 'xl', 'solid');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible (iconName: "test", iconSize: "xxs", variant: "line")', async () => {
        setupIcon('test', 'xxs', 'line');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  });
});
