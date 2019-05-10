import {
  ComponentFixture,
  fakeAsync,
  inject,
  tick,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  StacheOmnibarAdapterService
} from '../shared/omnibar-adapter.service';

import {
  AffixTopFixtureComponent
} from './fixtures/affix-top.component.fixture';

import {
  AffixFixtureModule
} from './fixtures/affix.module.fixture';

import {
  StacheAffixTopDirective
} from './affix-top.directive';

describe('StacheAffixTopDirective', () => {
  const className: string = StacheAffixTopDirective.AFFIX_CLASS_NAME;

  let omnibarAdapterService: StacheOmnibarAdapterService;
  let fixture: ComponentFixture<AffixTopFixtureComponent>;
  let directiveElements: any[];

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AffixFixtureModule
      ]
    });

    fixture = TestBed.createComponent(AffixTopFixtureComponent);
    directiveElements = fixture.debugElement.queryAll(By.directive(StacheAffixTopDirective));
  });

  beforeEach(inject(
    [
      StacheOmnibarAdapterService
    ],
    (
      _omnibarAdapterService: StacheOmnibarAdapterService
    ) => {
      omnibarAdapterService = _omnibarAdapterService;
    })
  );

  it('should exist on the component', fakeAsync(() => {
    detectChanges();

    expect(directiveElements[0]).not.toBeNull();
  }));

  it('should call the on window scroll method when the window scrolls',
    fakeAsync(() => {
      const directiveInstance = directiveElements[0].injector.get(StacheAffixTopDirective);

      detectChanges();

      spyOn(directiveInstance, 'onWindowScroll').and.callThrough();
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      expect(directiveInstance.onWindowScroll).toHaveBeenCalled();
    })
  );

  it('should add or remove stache-affix-top class based on offset to window ratio',
    fakeAsync(() => {
      detectChanges();

      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '50px';

      window.scrollTo(0, 500);
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).toHaveCssClass(className);

      window.scrollTo(0, 0);
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should take the omnibar height into consideration in the offset to window ratio',
    fakeAsync(() => {
      detectChanges();

      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '50px';

      window.scrollTo(0, 25);
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).not.toHaveCssClass(className);

      spyOn(omnibarAdapterService, 'getHeight').and.returnValue(50);

      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).toHaveCssClass(className);
    })
  );

  it('should add or remove stache-affix-top class to a component\'s first child',
    fakeAsync(() => {
      detectChanges();

      window.scrollTo(0, 500);
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      const element = directiveElements[1].nativeElement.children[0];

      expect(element).toHaveCssClass(className);

      window.scrollTo(0, 0);
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should not attempt to reset the element if it already has',
    fakeAsync(() => {
      detectChanges();

      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '500px';

      window.scrollTo(0, 0);
      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).not.toHaveCssClass(className);

      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should set the maxHeight of the element based on footer offset - window pageYOffset - omnibar height',
    fakeAsync(() => {
      detectChanges();

      const element = directiveElements[0].nativeElement;
      const directiveInstance = directiveElements[0].injector.get(StacheAffixTopDirective);

      directiveInstance.footerWrapper = {
        offsetParent: undefined,
        offsetTop: 450,
        getBoundingClientRect() {
          return {
            top: 0
          };
        }
      } as HTMLElement;

      window.resizeTo(1200, 800);
      window.scrollBy(0, 350);

      spyOn(omnibarAdapterService, 'getHeight').and.returnValue(50);

      SkyAppTestUtility.fireDomEvent(window, 'scroll');

      detectChanges();

      expect(element.style.height).toEqual('50px');
    })
  );
});
