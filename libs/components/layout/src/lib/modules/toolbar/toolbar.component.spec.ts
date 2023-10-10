import { TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyContentInfoProvider } from '@skyux/core';

import { SkyToolbarSectionedTestComponent } from './fixtures/toolbar-sectioned.component.fixture';
import { SkyToolbarTestComponent } from './fixtures/toolbar.component.fixture';
import { SkyToolbarFixturesModule } from './fixtures/toolbar.module.fixture';

describe('toolbar component', () => {
  describe('standard', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyToolbarFixturesModule],
      });
    });

    it('should create a toolbar with transcluded items', () => {
      const fixture = TestBed.createComponent(SkyToolbarTestComponent);
      const el = fixture.nativeElement as HTMLElement;

      fixture.detectChanges();

      const buttonEls = el.querySelectorAll(
        '.sky-toolbar-container .sky-toolbar-item .sky-btn'
      );

      expect(buttonEls.item(0)).toHaveText('Button 1');
      expect(buttonEls.item(1)).toHaveText('Button 2');
    });

    it('should call the content info provider for standard components with undefined if no listDescriptor is given', async () => {
      const patchInfoSpy = spyOn(
        SkyContentInfoProvider.prototype,
        'patchInfo'
      ).and.stub();

      const fixture = TestBed.createComponent(SkyToolbarTestComponent);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(patchInfoSpy.calls.count()).toBe(1);
      expect(patchInfoSpy.calls.all()[0].args).toEqual([
        { descriptor: undefined },
      ]);
    });

    it('should call the default input provider for standard components with the listDescriptor if a listDescriptor is given', async () => {
      const patchInfoSpy = spyOn(
        SkyContentInfoProvider.prototype,
        'patchInfo'
      ).and.stub();

      const fixture = TestBed.createComponent(SkyToolbarTestComponent);
      fixture.componentInstance.listDescriptor = 'constituents';
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(patchInfoSpy.calls.count()).toBe(1);
      expect(patchInfoSpy.calls.all()[0].args).toEqual([
        { descriptor: { type: 'text', value: 'constituents' } },
      ]);
    });

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(SkyToolbarTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('sectioned', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyToolbarFixturesModule],
      });
    });

    it('should create a toolbar with sections with transcluded items', () => {
      const fixture = TestBed.createComponent(SkyToolbarSectionedTestComponent);
      const el = fixture.nativeElement as HTMLElement;

      fixture.detectChanges();

      const buttonEls = el.querySelectorAll(
        '.sky-toolbar-container .sky-toolbar-section .sky-toolbar-item .sky-btn'
      );

      expect(buttonEls.item(0)).toHaveText('Button 1');
      expect(buttonEls.item(1)).toHaveText('Button 2');

      expect(el.querySelector('.sky-toolbar-container')).toHaveCssClass(
        'sky-toolbar-sectioned'
      );
    });

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(SkyToolbarSectionedTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
