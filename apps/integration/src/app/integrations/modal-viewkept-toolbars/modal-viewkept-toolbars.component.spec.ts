import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RendererFactory2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { ModalViewkeptToolbarsComponent } from './modal-viewkept-toolbars.component';
import { ModalViewkeptToolbarsModule } from './modal-viewkept-toolbars.module';

describe('Modals with viewkept toolbars', () => {
  function closeModal(): void {
    getModalCloseButton()?.click();
    fixture.detectChanges();
  }

  function getModalCloseButton(): HTMLElement | null {
    return document.querySelector('#modal-viewkept-toolbars-modal-close');
  }

  function getModalContent(): HTMLElement | null {
    return document.querySelector('.sky-modal-content');
  }

  function getModalHeader(): HTMLElement | null {
    return document.querySelector('.sky-modal-header');
  }

  function getModalTrigger(): HTMLElement | null {
    return document.querySelector('#modal-viewkept-toolbars-modal-trigger');
  }

  function getToolbarContainers(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(
      '.sky-modal-content .sky-toolbar-container',
    );
  }

  function openModal(): void {
    getModalTrigger()?.click();
  }

  async function scrollContentDown(): Promise<void> {
    getModalContent()?.scrollTo({
      top: 500,
    });
    SkyAppTestUtility.fireDomEvent(getModalContent(), 'scroll', {
      bubbles: false,
    });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  let fixture: ComponentFixture<ModalViewkeptToolbarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ModalViewkeptToolbarsModule,
      ],
      providers: [
        SkyThemeService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(ModalViewkeptToolbarsComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    closeModal();
  });

  describe('modern theme', () => {
    beforeEach(async () => {
      TestBed.inject(SkyThemeService).init(
        document.body,
        TestBed.inject(RendererFactory2).createRenderer(undefined, null),
        new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
      );

      await fixture.whenStable();
      openModal();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    afterEach(() => {
      // Revert theme
      TestBed.inject(SkyThemeService).setTheme(
        new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
      );
    });

    it('should not have a modal header box shadow when scroll is active', async () => {
      await scrollContentDown();
      expect(
        window.getComputedStyle(getModalHeader() as Element).boxShadow,
      ).toBe('none');
    });

    it('should set the background color and padding correctly', async () => {
      await scrollContentDown();
      const toolbarContainers = getToolbarContainers();

      toolbarContainers.forEach((toolbar) => {
        const toolbarStyle = window.getComputedStyle(toolbar);
        expect(toolbarStyle.backgroundColor).toBe('rgb(255, 255, 255)');
        expect(toolbarStyle.paddingLeft).toBe('24px');
        expect(toolbarStyle.paddingRight).toBe('24px');
      });
    });
  });

  describe('default theme', () => {
    beforeEach(async () => {
      openModal();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should not set the padding', async () => {
      await scrollContentDown();
      const toolbarContainers = getToolbarContainers();

      toolbarContainers.forEach((toolbar) => {
        const toolbarStyle = window.getComputedStyle(toolbar);
        expect(toolbarStyle.paddingLeft).not.toBe('30px');
        expect(toolbarStyle.paddingRight).not.toBe('30px');
      });
    });
  });
});
