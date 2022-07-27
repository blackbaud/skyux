import { RendererFactory2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyModalService } from '@skyux/modals';
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
    getModalCloseButton().click();
    fixture.detectChanges();
  }

  function getModalCloseButton(): HTMLElement {
    return document.querySelector('#modal-viewkept-toolbars-modal-close');
  }

  function getModalContent(): HTMLElement {
    return document.querySelector('.sky-modal-content');
  }

  function getModalHeader(): HTMLElement {
    return document.querySelector('.sky-modal-header');
  }

  function getModalTrigger(): HTMLElement {
    return document.querySelector('#modal-viewkept-toolbars-modal-trigger');
  }

  function getToolbarContainers(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(
      '.sky-modal-content .sky-toolbar-container'
    );
  }

  function openModal(): void {
    getModalTrigger().click();
    fixture.detectChanges;
  }

  async function scrollContentDown(): Promise<void> {
    getModalContent().scrollTo({
      top: 500,
    });
    SkyAppTestUtility.fireDomEvent(getModalContent(), 'scroll', {
      bubbles: false,
    });
    fixture.detectChanges();
    return fixture.whenStable();
  }

  let fixture: ComponentFixture<ModalViewkeptToolbarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ModalViewkeptToolbarsModule,
      ],
      providers: [SkyThemeService],
    });

    fixture = TestBed.createComponent(ModalViewkeptToolbarsComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    closeModal();

    // NOTE: This is important as it ensures that the modal host component is fully disposed of
    // between tests. This is important as the modal host might need a different set of component
    // injectors than the previous test.
    TestBed.inject(SkyModalService).dispose();
  });

  describe('modern theme', () => {
    beforeEach(async () => {
      TestBed.inject(SkyThemeService).init(
        document.body,
        TestBed.inject(RendererFactory2).createRenderer(undefined, undefined),
        new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        )
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
          SkyThemeMode.presets.light
        )
      );
    });

    it('should not have a modal header box shadow when scroll is active', async () => {
      await scrollContentDown();
      expect(window.getComputedStyle(getModalHeader()).boxShadow).toBe('none');
    });

    it('should set the background color and padding correctly', async () => {
      await scrollContentDown();
      const toolbarContainers = getToolbarContainers();

      toolbarContainers.forEach((toolbar) => {
        const toolbarStyle = window.getComputedStyle(toolbar);
        expect(toolbarStyle.backgroundColor).toBe('rgb(255, 255, 255)');
        expect(toolbarStyle.paddingLeft).toBe('30px');
        expect(toolbarStyle.paddingRight).toBe('30px');
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
