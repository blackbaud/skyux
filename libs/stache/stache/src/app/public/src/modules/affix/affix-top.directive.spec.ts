import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, inject, tick, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheAffixTopDirective } from './affix-top.directive';
import { AffixTopTestComponent } from './fixtures/affix-top.component.fixture';
import { StacheCodeComponent } from '../code';

import { StacheWindowRef, StacheOmnibarAdapterService, TestUtility } from '../shared';

describe('AffixTopTestDirective', () => {
  const className: string = StacheAffixTopDirective.AFFIX_CLASS_NAME;
  let testOmnibarHeight: number = 0;
  class MockOmnibarService {
    public getHeight(): number {
      return testOmnibarHeight;
    }
  }

  const mockOmnibarService = new MockOmnibarService();
  let component: AffixTopTestComponent;
  let fixture: ComponentFixture<AffixTopTestComponent>;
  let directiveElements: any[];
  let windowRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheAffixTopDirective,
        AffixTopTestComponent,
        StacheCodeComponent
      ],
      providers: [
        StacheWindowRef,
        {
          provide: StacheOmnibarAdapterService,
          useValue: mockOmnibarService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffixTopTestComponent);
    component = fixture.componentInstance;
    directiveElements = fixture.debugElement.queryAll(By.directive(StacheAffixTopDirective));
  });

  beforeEach(inject([StacheWindowRef], (service: any) => {
    windowRef = service.nativeWindow;
  }));

  it('should exist on the component', () => {
    expect(directiveElements[0]).not.toBeNull();
  });

  it('should call the on window scroll method when the window scrolls', fakeAsync(() => {
      const directiveInstance = directiveElements[0].injector.get(StacheAffixTopDirective);

      fixture.detectChanges();
      tick();

      spyOn(directiveInstance, 'onWindowScroll').and.callThrough();
      TestUtility.triggerDomEvent(windowRef, 'scroll');

      expect(directiveInstance.onWindowScroll).toHaveBeenCalled();
    })
  );

  it('should add or remove stache-affix-top class based on offset to window ratio',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '50px';

      windowRef.scrollTo(0, 500);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).toHaveCssClass(className);

      windowRef.scrollTo(0, 0);
      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should take the omnibar height into consideration in the offset to window ratio',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '50px';

      windowRef.scrollTo(0, 25);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);

      testOmnibarHeight = 50;
      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).toHaveCssClass(className);

      testOmnibarHeight = 0;
    })
  );

  it('should add or remove stache-affix-top class to a component\'s first child',
    fakeAsync(() => {
      const element = directiveElements[1].nativeElement.children[0];

      windowRef.scrollTo(0, 500);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).toHaveCssClass(className);

      windowRef.scrollTo(0, 0);
      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should not attempt to reset the element if it already has',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '500px';
      windowRef.scrollTo(0, 0);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should set the maxHeight of the element based on footer offset - window pageYOffset - omnibar height',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      const directiveInstance = directiveElements[0].injector.get(StacheAffixTopDirective);
      fixture.detectChanges();
      tick();
      directiveInstance.footerWrapper = {
        offsetParent: undefined,
        offsetTop: 450,
        getBoundingClientRect() {
          return {
            top: 0
          };
        }
      } as HTMLElement;

      windowRef.resizeTo(1200, 800);
      windowRef.scrollBy(0, 350);
      testOmnibarHeight = 50;

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element.style.height).toEqual('50px');
    })
  );
});
