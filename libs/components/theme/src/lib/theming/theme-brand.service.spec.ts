import { DOCUMENT, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyThemeBrand } from './theme-brand';
import { SkyThemeBrandService } from './theme-brand.service';

describe('SkyThemeBrandService', () => {
  let service: SkyThemeBrandService;
  let mockHostEl: Element;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockDocument: {
    head: HTMLHeadElement | null;
  };
  let mockHead: jasmine.SpyObj<HTMLHeadElement>;
  let createdLinkElements: jasmine.SpyObj<HTMLLinkElement>[];

  beforeEach(() => {
    createdLinkElements = [];
    mockHead = jasmine.createSpyObj('HTMLHeadElement', ['append']);
    mockDocument = {
      head: mockHead,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    service = TestBed.inject(SkyThemeBrandService);

    mockHostEl = document.createElement('div');

    mockRenderer = jasmine.createSpyObj('Renderer2', [
      'createElement',
      'setAttribute',
      'addClass',
      'removeClass',
      'appendChild',
    ]);

    // Return a new mock link element each time createElement is called and track them
    mockRenderer.createElement.and.callFake(() => {
      const newMockLinkElement = jasmine.createSpyObj('HTMLLinkElement', [
        'remove',
      ]);
      createdLinkElements.push(newMockLinkElement);
      return newMockLinkElement;
    });
  });

  describe('registerBrand()', () => {
    it('should register a brand', () => {
      const brand = new SkyThemeBrand('test', '1.0.0');

      expect(() => service.registerBrand(brand)).not.toThrow();
    });
  });

  describe('unregisterBrand()', () => {
    it('should unregister a brand', () => {
      const brand = new SkyThemeBrand('test', '1.0.0');
      service.registerBrand(brand);

      expect(() => service.unregisterBrand('test')).not.toThrow();
    });
  });

  describe('updateBrand()', () => {
    it('should resolve registered brand and update DOM when brand changes', () => {
      const originalBrand = new SkyThemeBrand('test', '1.0.0');
      const registeredBrand = new SkyThemeBrand('test', '2.0.0');

      service.registerBrand(registeredBrand);

      service.updateBrand(mockHostEl, mockRenderer, originalBrand, undefined);

      // Should use the registered brand for DOM operations
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        'sky-theme-brand-base',
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        registeredBrand.hostClass,
      );
      expect(mockRenderer.createElement).toHaveBeenCalledWith('link');
      expect(mockRenderer.appendChild).toHaveBeenCalledWith(
        mockHead,
        jasmine.any(Object),
      );
    });

    it('should use original brand when no registered brand exists', () => {
      const brand = new SkyThemeBrand('test', '1.0.0');

      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        brand.hostClass,
      );
    });

    it('should update both host class and stylesheet when brand changes', () => {
      const previousBrand = new SkyThemeBrand('old-brand', '1.0.0');
      const currentBrand = new SkyThemeBrand('new-brand', '2.0.0');

      // First set up the previous brand to establish a stylesheet
      service.updateBrand(mockHostEl, mockRenderer, previousBrand, undefined);

      // Reset mocks to focus on the brand change
      mockRenderer.removeClass.calls.reset();
      mockRenderer.addClass.calls.reset();
      mockRenderer.createElement.calls.reset();
      mockRenderer.appendChild.calls.reset();
      createdLinkElements.forEach((el) => el.remove.calls.reset());

      // Now change to the new brand
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        currentBrand,
        previousBrand,
      );

      // Verify host class changes
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        previousBrand.hostClass,
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        currentBrand.hostClass,
      );

      // Verify stylesheet creation and removal
      expect(createdLinkElements[0].remove).toHaveBeenCalled();
      expect(mockRenderer.createElement).toHaveBeenCalledWith('link');
      expect(mockRenderer.appendChild).toHaveBeenCalledWith(
        mockHead,
        jasmine.any(Object),
      );
    });

    it('should not update when host classes are the same', () => {
      const brand1 = new SkyThemeBrand('same-brand', '1.0.0');
      const brand2 = new SkyThemeBrand('same-brand', '1.0.0');

      service.updateBrand(mockHostEl, mockRenderer, brand2, brand1);

      // Should not perform any DOM operations
      expect(mockRenderer.removeClass).not.toHaveBeenCalled();
      expect(mockRenderer.addClass).not.toHaveBeenCalled();
      expect(mockRenderer.createElement).not.toHaveBeenCalled();
      expect(mockRenderer.appendChild).not.toHaveBeenCalled();
    });

    it('should update when no previous brand exists', () => {
      const currentBrand = new SkyThemeBrand('new-brand', '1.0.0');

      service.updateBrand(mockHostEl, mockRenderer, currentBrand, undefined);

      // Verify host class changes - should add base class and brand class
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        'sky-theme-brand-base',
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        currentBrand.hostClass,
      );

      // Verify stylesheet creation
      expect(mockRenderer.createElement).toHaveBeenCalledWith('link');
      expect(mockRenderer.appendChild).toHaveBeenCalledWith(
        mockHead,
        jasmine.any(Object),
      );
    });

    it('should handle switching to blackbaud brand (no stylesheet)', () => {
      const previousBrand = new SkyThemeBrand('custom', '1.0.0');
      const blackbaudBrand = new SkyThemeBrand('blackbaud', '1.0.0');

      // First establish a custom brand
      service.updateBrand(mockHostEl, mockRenderer, previousBrand, undefined);

      // Reset spies to focus on the switch
      createdLinkElements.forEach((el) => el.remove.calls.reset());
      mockRenderer.createElement.calls.reset();
      mockRenderer.appendChild.calls.reset();
      mockRenderer.addClass.calls.reset();
      mockRenderer.removeClass.calls.reset();

      // Switch to blackbaud brand
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        blackbaudBrand,
        previousBrand,
      );

      // Should remove previous brand class and add blackbaud class
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        previousBrand.hostClass,
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        blackbaudBrand.hostClass,
      );

      // Should remove stylesheet but not create a new one for blackbaud
      expect(createdLinkElements[0].remove).toHaveBeenCalled();
      expect(mockRenderer.createElement).not.toHaveBeenCalled();
      expect(mockRenderer.appendChild).not.toHaveBeenCalled();
    });

    it('should handle removing brand (switching to undefined)', () => {
      const previousBrand = new SkyThemeBrand('custom', '1.0.0');

      // First establish a brand
      service.updateBrand(mockHostEl, mockRenderer, previousBrand, undefined);

      // Reset spies to focus on the removal
      createdLinkElements.forEach((el) => el.remove.calls.reset());
      mockRenderer.removeClass.calls.reset();

      // Remove the brand
      service.updateBrand(mockHostEl, mockRenderer, undefined, previousBrand);

      // Should remove both the brand class and the base class
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        previousBrand.hostClass,
      );
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        'sky-theme-brand-base',
      );

      // Should remove stylesheet
      expect(createdLinkElements[0].remove).toHaveBeenCalled();
    });
  });

  describe('destroy()', () => {
    it('should remove brand stylesheet if one exists', () => {
      const brand = new SkyThemeBrand('custom', '1.0.0');

      // Establish a brand with stylesheet first
      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      createdLinkElements.forEach((el) => el.remove.calls.reset());

      service.destroy();

      expect(createdLinkElements[0].remove).toHaveBeenCalled();
    });

    it('should not throw if no stylesheet exists', () => {
      expect(() => service.destroy()).not.toThrow();
    });
  });

  describe('favicon handling', () => {
    it('should add favicon when brand has faviconUrl', () => {
      const brand = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon.ico',
      );

      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      // Should create 3 favicon elements and 1 stylesheet element
      expect(mockRenderer.createElement).toHaveBeenCalledTimes(4);
      expect(mockRenderer.createElement).toHaveBeenCalledWith('link');

      // Verify apple-touch-icon attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'apple-touch-icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'sizes',
        '180x180',
      );

      // Verify icon elements
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'sizes',
        '32x32',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'sizes',
        '16x16',
      );

      // Verify all have the same href
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://example.com/favicon.ico',
      );

      // Should append all elements to head (3 favicon icons + 1 stylesheet)
      expect(mockRenderer.appendChild).toHaveBeenCalledTimes(4);
    });

    it('should update existing favicon when brand changes', () => {
      // Use the same brand instance but update the favicon URL
      const brand = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon1.ico',
      );

      // Set first brand with favicon
      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      // Reset spies to focus on the update
      mockRenderer.createElement.calls.reset();
      mockRenderer.setAttribute.calls.reset();
      mockRenderer.appendChild.calls.reset();

      // Create a new brand instance with different favicon but same name
      const updatedBrand = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon2.ico',
      );

      // Update to brand with different favicon URL
      service.updateBrand(mockHostEl, mockRenderer, updatedBrand, brand);

      // Should update all 3 favicon href attributes to the new URL
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://example.com/favicon2.ico',
      );
      // Should not create new elements since favicon icons already exist
      expect(mockRenderer.createElement).not.toHaveBeenCalled();
      // Should not append again since favicon icons already exist
      expect(mockRenderer.appendChild).not.toHaveBeenCalled();
    });

    it('should remove favicon when switching to brand without faviconUrl', () => {
      const brandWithFavicon = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon.ico',
      );
      const brandWithoutFavicon = new SkyThemeBrand('test2', '1.0.0');

      // Set brand with favicon
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithFavicon,
        undefined,
      );

      // Verify favicon was created (should have 4 elements: 1 stylesheet + 3 favicon icons)
      expect(createdLinkElements.length).toBe(4);
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'apple-touch-icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'icon',
      );

      // Switch to brand without favicon
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithoutFavicon,
        brandWithFavicon,
      );

      // Verify all 3 favicon elements were removed (only stylesheet elements remain)
      expect(createdLinkElements[1].remove).toHaveBeenCalled(); // First favicon
      expect(createdLinkElements[2].remove).toHaveBeenCalled(); // Second favicon
      expect(createdLinkElements[3].remove).toHaveBeenCalled(); // Third favicon
    });

    it('should handle switching between different brands with favicon icons', () => {
      const brand1 = new SkyThemeBrand(
        'brand1',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon1.ico',
      );
      const brand2 = new SkyThemeBrand(
        'brand2',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon2.ico',
      );

      // Set first brand
      service.updateBrand(mockHostEl, mockRenderer, brand1, undefined);
      const initialElementCount = createdLinkElements.length;

      // Switch to second brand
      service.updateBrand(mockHostEl, mockRenderer, brand2, brand1);

      // Verify new stylesheet element was created but favicon elements were reused
      expect(createdLinkElements.length).toBeGreaterThan(initialElementCount);
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://example.com/favicon2.ico',
      );
    });

    it('should remove favicon when switching to undefined brand', () => {
      const brandWithFavicon = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon.ico',
      );

      // Set brand with favicon
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithFavicon,
        undefined,
      );

      // Track the created favicon elements (indices 1, 2, 3 - stylesheet is index 0)
      const faviconElements = createdLinkElements.slice(1, 4);

      // Switch to undefined brand
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        undefined,
        brandWithFavicon,
      );

      // Verify all favicon elements were removed
      faviconElements.forEach((faviconElement) => {
        expect(faviconElement.remove).toHaveBeenCalled();
      });
    });

    it('should create three favicon elements with correct attributes', () => {
      const brand = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon.ico',
      );

      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      // Verify correct number of elements created (1 stylesheet + 3 favicon icons)
      expect(mockRenderer.createElement).toHaveBeenCalledTimes(4);

      // Verify apple-touch-icon attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'apple-touch-icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'sizes',
        '180x180',
      );

      // Verify first icon element attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'sizes',
        '32x32',
      );

      // Verify second icon element attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'sizes',
        '16x16',
      );

      // Verify all elements have the same href
      const hrefCalls = mockRenderer.setAttribute.calls
        .all()
        .filter((call) => call.args[1] === 'href');
      expect(hrefCalls.length).toBe(4); // 3 favicon + 1 stylesheet
      hrefCalls.slice(1).forEach((call) => {
        // Skip stylesheet href
        expect(call.args[2]).toBe('https://example.com/favicon.ico');
      });
    });
  });

  describe('stylesheet SRI hash', () => {
    it('should add integrity and crossorigin attributes when brand has sriHash', () => {
      const brandWithSriHash = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        'https://example.com/brand.css',
        'sha384-test-hash-value',
      );

      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithSriHash,
        undefined,
      );

      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'integrity',
        'sha384-test-hash-value',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'crossorigin',
        'anonymous',
      );
    });

    it('should not add integrity attributes when brand has no sriHash', () => {
      const brandWithoutSriHash = new SkyThemeBrand('test', '1.0.0');

      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithoutSriHash,
        undefined,
      );

      expect(mockRenderer.setAttribute).not.toHaveBeenCalledWith(
        jasmine.any(Object),
        'integrity',
        jasmine.any(String),
      );
      expect(mockRenderer.setAttribute).not.toHaveBeenCalledWith(
        jasmine.any(Object),
        'crossorigin',
        jasmine.any(String),
      );
    });
  });

  describe('custom style URLs', () => {
    it('should use custom styleUrl when provided', () => {
      const brandWithCustomUrl = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        'https://custom.example.com/my-brand.css',
      );

      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithCustomUrl,
        undefined,
      );

      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://custom.example.com/my-brand.css',
      );
    });

    it('should build default URL when no custom styleUrl provided', () => {
      const brandWithoutCustomUrl = new SkyThemeBrand('my-brand', '2.1.0');

      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithoutCustomUrl,
        undefined,
      );

      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://sky.blackbaudcdn.net/static/skyux-brand-my-brand/2.1.0/assets/scss/my-brand.css',
      );
    });
  });

  describe('mask icon handling', () => {
    it('should add mask icon when brand has maskIcon', () => {
      const brand = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { url: 'https://example.com/mask-icon.svg', color: '#000000' },
      );

      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      expect(mockRenderer.createElement).toHaveBeenCalledWith('link');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'mask-icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://example.com/mask-icon.svg',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'color',
        '#000000',
      );
      expect(mockRenderer.appendChild).toHaveBeenCalled();
    });

    it('should update existing mask icon when brand changes', () => {
      const brand1 = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { url: 'https://example.com/mask-icon1.svg', color: '#000000' },
      );

      // Set first brand with mask icon
      service.updateBrand(mockHostEl, mockRenderer, brand1, undefined);

      // Reset spies to focus on the update
      mockRenderer.createElement.calls.reset();
      mockRenderer.setAttribute.calls.reset();
      mockRenderer.appendChild.calls.reset();

      const brand2 = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { url: 'https://example.com/mask-icon2.svg', color: '#ff0000' },
      );

      // Update to brand with different mask icon
      service.updateBrand(mockHostEl, mockRenderer, brand2, brand1);

      // Should update the mask icon attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://example.com/mask-icon2.svg',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'color',
        '#ff0000',
      );
      // Should not create new element since mask icon already exists
      expect(mockRenderer.createElement).not.toHaveBeenCalled();
      // Should not append again since mask icon already exists
      expect(mockRenderer.appendChild).not.toHaveBeenCalled();
    });

    it('should remove mask icon when switching to brand without maskIcon', () => {
      const brandWithMaskIcon = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { url: 'https://example.com/mask-icon.svg', color: '#000000' },
      );
      const brandWithoutMaskIcon = new SkyThemeBrand('test2', '1.0.0');

      // Set brand with mask icon
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithMaskIcon,
        undefined,
      );

      // Verify mask icon was created
      const maskIconElement =
        createdLinkElements[createdLinkElements.length - 1];

      // Switch to brand without mask icon
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithoutMaskIcon,
        brandWithMaskIcon,
      );

      // Verify mask icon was removed
      expect(maskIconElement.remove).toHaveBeenCalled();
    });

    it('should remove mask icon when switching to undefined brand', () => {
      const brandWithMaskIcon = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { url: 'https://example.com/mask-icon.svg', color: '#000000' },
      );

      // Set brand with mask icon
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        brandWithMaskIcon,
        undefined,
      );

      // Track the created mask icon element
      const maskIconElement =
        createdLinkElements[createdLinkElements.length - 1];

      // Switch to undefined brand
      service.updateBrand(
        mockHostEl,
        mockRenderer,
        undefined,
        brandWithMaskIcon,
      );

      expect(maskIconElement.remove).toHaveBeenCalled();
    });

    it('should handle brand with both favicon and mask icon', () => {
      const brand = new SkyThemeBrand(
        'test',
        '1.0.0',
        undefined,
        undefined,
        undefined,
        undefined,
        'https://example.com/favicon.ico',
        { url: 'https://example.com/mask-icon.svg', color: '#000000' },
      );

      service.updateBrand(mockHostEl, mockRenderer, brand, undefined);

      // Should create elements: 1 stylesheet + 3 favicon icons + 1 mask icon = 5 total
      expect(mockRenderer.createElement).toHaveBeenCalledTimes(5);

      // Verify favicon attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'apple-touch-icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'icon',
      );

      // Verify mask icon attributes
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'rel',
        'mask-icon',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'href',
        'https://example.com/mask-icon.svg',
      );
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        jasmine.any(Object),
        'color',
        '#000000',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle when document head is not found', () => {
      // Mock querySelector to return null (no head element)
      mockDocument.head = null;

      const brand = new SkyThemeBrand('test', '1.0.0');

      // Should not throw when head is null
      expect(() =>
        service.updateBrand(mockHostEl, mockRenderer, brand, undefined),
      ).not.toThrow();
    });

    it('should handle brand host class updates correctly when switching from brand to no brand', () => {
      const brandWithClass = new SkyThemeBrand('test-brand', '1.0.0');

      // First set a brand
      service.updateBrand(mockHostEl, mockRenderer, brandWithClass, undefined);

      // Reset to focus on the removal
      mockRenderer.removeClass.calls.reset();

      // Remove brand (set to undefined)
      service.updateBrand(mockHostEl, mockRenderer, undefined, brandWithClass);

      // Should remove both the brand class and the base class
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        brandWithClass.hostClass,
      );
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        'sky-theme-brand-base',
      );
    });
  });
});
