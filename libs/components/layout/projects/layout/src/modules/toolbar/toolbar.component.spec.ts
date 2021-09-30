import {
  TestBed, async
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import { ToolbarTestComponent } from './fixtures/toolbar.component.fixture';
import { ToolbarSectionedTestComponent } from './fixtures/toolbar-sectioned.component.fixture';

import { SkyToolbarModule } from './toolbar.module';

describe('toolbar component', () => {
  describe('standard', () => {
     beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          ToolbarTestComponent
        ],
        imports: [
          SkyToolbarModule
        ]
      });
    });

    it('should create a toolbar with transcluded items', () => {
      let fixture = TestBed.createComponent(ToolbarTestComponent);
      let el = fixture.nativeElement as HTMLElement;

      fixture.detectChanges();

      let buttonEls = el.querySelectorAll('.sky-toolbar-container .sky-toolbar-item .sky-btn');

      expect(buttonEls.item(0)).toHaveText('Button 1');
      expect(buttonEls.item(1)).toHaveText('Button 2');

    });

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(ToolbarTestComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('sectioned', () => {
     beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          ToolbarSectionedTestComponent
        ],
        imports: [
          SkyToolbarModule
        ]
      });
    });

    it('should create a toolbar with sections with transcluded items', () => {
      let fixture = TestBed.createComponent(ToolbarSectionedTestComponent);
      let el = fixture.nativeElement as HTMLElement;

      fixture.detectChanges();

      let buttonEls =
      el.querySelectorAll('.sky-toolbar-container .sky-toolbar-section .sky-toolbar-item .sky-btn');

      expect(buttonEls.item(0)).toHaveText('Button 1');
      expect(buttonEls.item(1)).toHaveText('Button 2');

      expect(el.querySelector('.sky-toolbar-container')).toHaveCssClass('sky-toolbar-sectioned');

    });

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(ToolbarSectionedTestComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });
});
