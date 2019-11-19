import {
  TestBed,
  ComponentFixture,
  async
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkySearchModule
} from './search.module';

import {
  SkySearchComponent
} from './search.component';

import {
  SearchTestComponent
} from './fixtures/search.component.fixture';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '@skyux/core';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  SkyAppResourcesTestService
} from '@skyux/i18n/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Search component', () => {
  let fixture: ComponentFixture<SearchTestComponent>;
  let component: SearchTestComponent;
  let element: DebugElement;
  let mockMediaQueryService: MockSkyMediaQueryService;

  beforeEach(() => {

    mockMediaQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      declarations: [
        SearchTestComponent
      ],
      imports: [
        SkySearchModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: SkyMediaQueryService, useValue: mockMediaQueryService},
        {
          provide: SkyAppResourcesService,
          useClass: SkyAppResourcesTestService
        }
      ]
    });

    fixture = TestBed.overrideComponent(SkySearchComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService
          }
        ]
      }
    })
    .createComponent(SearchTestComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement as DebugElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  function setInput(text: string) {
    let inputEvent = document.createEvent('Event');
    let params = {
      bubbles: false,
      cancelable: false
    };
    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    let inputEl = element.query(By.css('input'));
    inputEl.nativeElement.value = text;

    inputEl.nativeElement.dispatchEvent(inputEvent);
    fixture.detectChanges();

    inputEl.nativeElement.dispatchEvent(changeEvent);
    fixture.detectChanges();
  }

  function setNgModel(text: string) {
    let inputEvent = document.createEvent('Event');
    let params = {
      bubbles: false,
      cancelable: false
    };
    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    let inputEl = element.query(By.css('input'));
    inputEl.nativeElement.value = text;

    inputEl.nativeElement.dispatchEvent(inputEvent);
    fixture.detectChanges();
  }

  function triggerInputEnter() {
    let inputEl = element.query(By.css('input'));
    inputEl.triggerEventHandler('keyup', { which: 13});
    fixture.detectChanges();
  }

  function triggerApplyButton() {
    let applyEl = element.query(By.css('.sky-search-btn-apply'));
    applyEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
  }

  function triggerClearButton() {
    let clearEl = element.query(By.css('.sky-search-btn-clear'));
    clearEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
  }

  function triggerFocus() {
    let inputEl = element.query(By.css('input'));
    inputEl.triggerEventHandler('focus', undefined);
    fixture.detectChanges();
  }

  function triggerBlur() {
    let inputEl = element.query(By.css('input'));
    inputEl.triggerEventHandler('blur', undefined);
    fixture.detectChanges();
  }

  function triggerOpenButton() {
    let openEl = element.query(By.css('.sky-search-btn-open'));
    openEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function triggerDismissButton() {
    let dismissEl = element.query(By.css('.sky-search-btn-dismiss'));
    dismissEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function triggerXsBreakpoint() {
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function triggerLgBreakpoint() {
    mockMediaQueryService.fire(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function verifySearchOpenMobile() {
    fixture.detectChanges();
    let searchDismissContainer = element.query(By.css('.sky-search-dismiss-container'));
    expect(element.query(By.css('.sky-search-btn-open')).nativeElement).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement)
      .toHaveCssClass('sky-search-dismiss-absolute');
    expect(element.query(By.css('.sky-search-btn-dismiss'))).not.toBeNull();
  }

  function verifySearchOpenFullScreen() {
    fixture.detectChanges();
    let searchDismissContainer = element.query(By.css('.sky-search-dismiss-container'));
    expect(element.query(By.css('.sky-search-btn-open')).nativeElement).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement).not
      .toHaveCssClass('sky-search-dismiss-absolute');
    expect(element.query(By.css('.sky-search-btn-dismiss'))).toBeNull();
  }

  function verifySearchOpenFullScreenFullWidth() {
    fixture.detectChanges();
    let searchDismissContainer = element.query(By.css('.sky-search-dismiss-container'));
    expect(element.query(By.css('.sky-search-btn-open')).nativeElement).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement)
      .toHaveCssClass('sky-search-dismiss-absolute');
    expect(element.query(By.css('.sky-search-btn-dismiss'))).toBeNull();
  }

  function verifySearchClosed() {
    fixture.detectChanges();
    let searchDismissContainer = element.query(By.css('.sky-search-dismiss-container'));

    expect(element.query(By.css('.sky-search-btn-open')).nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).not
      .toHaveCssClass('sky-search-dismiss-absolute');
  }

  describe('standard search', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

  it('should apply search text on enter press', () => {

    setInput('my search text');
    let inputEl = element.query(By.css('input'));

    inputEl.triggerEventHandler('keyup', { which: 23});
    fixture.detectChanges();
    expect(component.lastSearchTextApplied).not.toBe('my search text');

    triggerInputEnter();

    expect(component.lastSearchTextApplied).toBe('my search text');
  });

  it('should apply search text on apply button press', () => {
    setInput('applied text');
    triggerApplyButton();
    expect(component.lastSearchTextApplied).toBe('applied text');
  });

  it('should trim search text on apply button press', () => {
    setInput('  applied text   ');
    triggerApplyButton();
    expect(component.lastSearchTextApplied).toBe('applied text');
  });

  it('should search correctly with empty search text is applied', () => {
    component.searchComponent.applySearchText(undefined);
    expect(component.lastSearchTextApplied).toBeUndefined();
  });

  it('should emit search change event on ngModel change', () => {
    setNgModel('change text');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.lastSearchTextChanged).toBe('change text');
      expect(component.lastSearchTextApplied).not.toBe('change text');
    });
  });

  it('should set default placeholder text when none is specified', () => {
    fixture.detectChanges();

    expect(element.query(By.css('input')).attributes['placeholder']).toBe('Find in this list');
  });

  it('should override default placeholder text when placeholder text is provided', () => {
    component.placeholderText = 'hey ya';
    fixture.detectChanges();
    /*tslint:disable */
    expect(element.query(By.css('input')).attributes['placeholder']).toBe('hey ya');
    /*tslint:enable */
  });

  it('should show the clear button when search is applied', () => {
    expect(element.query(By.css('.sky-input-group-clear')).nativeElement).not.toBeVisible();
    setInput('applied text');
    triggerApplyButton();

    expect(element.query(By.css('.sky-input-group-clear')).nativeElement).toBeVisible();
  });

  it('should emit the apply event when clear button is clicked', () => {
    setInput('applied text');
    triggerApplyButton();
    triggerClearButton();

    expect(element.query(By.css('.sky-input-group-clear')).nativeElement).not.toBeVisible();
    expect(component.lastSearchTextApplied).toBe('');
    expect(component.lastSearchTextChanged).toBe('');
  });

  it('should emit the cleared event when clear button is clicked', () => {
    spyOn(component.searchComponent.searchClear, 'emit').and.callThrough();
    setInput('applied text');
    triggerApplyButton();
    triggerClearButton();

    expect(element.query(By.css('.sky-input-group-clear')).nativeElement).not.toBeVisible();
    expect(component.searchComponent.searchClear.emit).toHaveBeenCalled();
  });

  it('should apply the correct focus class', () => {
    triggerFocus();
    let containerEl = element.query(By.css('.sky-search-input-container.sky-search-input-focused'));
    expect(containerEl).not.toBeNull();
    triggerBlur();
    containerEl = element.query(By.css('.sky-search-input-container.sky-search-input-focused'));
    expect(containerEl).toBeNull();
  });

  it('should update search text when applySearchText is called with new search text', () => {
    component.searchComponent.applySearchText('new search text');
    fixture.detectChanges();
    expect(component.lastSearchTextApplied).toBe('new search text');

    component.searchComponent.applySearchText('');
    fixture.detectChanges();
    expect(component.lastSearchTextApplied).toBe('');
  });

  it('should set the clear button visibility when search binding changed', () => {
    component.searchText = 'whaddup';
    fixture.detectChanges();
    expect(element.query(By.css('.sky-input-group-clear')).nativeElement).toBeVisible();
  });

  it('should delay the search if debounce is used', async(() => {
    component.searchComponent.searchTextChanged('debounce this please');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.searchComponent.searchText).toBe('debounce this please');
    });
  }));

  describe('animations', () => {

    describe('should animate the mobile search input open', () => {
      it('when the open button is pressed', async(() => {
        triggerXsBreakpoint().then(() => {
          fixture.detectChanges();
          triggerOpenButton().then(() => {
            verifySearchOpenMobile();
          });
        });
      }));

      it('when the screen changes from xsmall to large and the input is hidden', async(() => {
        triggerXsBreakpoint().then(() => {
          fixture.detectChanges();
          triggerLgBreakpoint().then(() => {
            verifySearchOpenFullScreen();
          });
        });
      }));

      it('when the screen changes from xsmall to large and the input is shown', async(() => {
        triggerXsBreakpoint().then(() => {
          fixture.detectChanges();
          triggerOpenButton().then(() => {
            fixture.detectChanges();
            triggerLgBreakpoint().then(() => {
              verifySearchOpenFullScreen();
            });
          });
        });
      }));

      it('when searchtext binding is changed and screen is xsmall', async(() => {
        triggerXsBreakpoint().then(() => {
          fixture.detectChanges();
          component.searchText = 'my search text';
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            verifySearchOpenMobile();
            expect(element.query(By.css('input')).properties['value']).toBe('my search text');
          });
        });
      }));
    });

    describe('should animate the mobile search input closed', () => {
      it('and show a button when screen is xsmall', async(() => {
        expect(element.query(By.css('.sky-search-btn-dismiss'))).toBeNull();
        triggerXsBreakpoint().then(() => {
          verifySearchClosed();
        });
      }));

      it('when the dismiss button is pressed', async(() => {
        triggerXsBreakpoint().then(() => {
          fixture.detectChanges();
          triggerOpenButton().then(() => {
            fixture.detectChanges();
            triggerDismissButton().then(() => {
              verifySearchClosed();
            });
          });
        });
      }));

      it('should show applied indication when search is applied', async(() => {
        setInput('applied stuff');
        triggerApplyButton();
        triggerXsBreakpoint().then(() => {
          fixture.detectChanges();
          expect(element.query(By.css('.sky-search-btn-open')).nativeElement)
            .toHaveCssClass('sky-search-btn-open-applied');
        });

      }));
    });
  });

  describe('expandMode none', () => {
    it('do nothing when open button pressed', async(() => {
      component.expandMode = 'none';
      fixture.detectChanges();
      triggerXsBreakpoint().then(() => {
        fixture.detectChanges();
        verifySearchOpenFullScreen();
        triggerOpenButton().then(() => {
          fixture.detectChanges();
          verifySearchOpenFullScreen();
        });
      });
    }));
  });

  describe('expandMode fit', () => {
    it('do nothing when open button pressed', async(() => {
      component.expandMode = 'fit';
      fixture.detectChanges();
      triggerXsBreakpoint().then(() => {
        fixture.detectChanges();
        verifySearchOpenFullScreenFullWidth();
        triggerOpenButton().then(() => {
          fixture.detectChanges();
          verifySearchOpenFullScreenFullWidth();
        });
      });
    }));
  });

  describe('expandMode responsive', () => {
    it('should beecome the selected mode when expandMode is cleared', async(() => {
      component.expandMode = 'fit';
      fixture.detectChanges();

      component.expandMode = undefined;
      fixture.detectChanges();

      triggerXsBreakpoint().then(() => {
        fixture.detectChanges();
        verifySearchClosed();
      });
    }));
  });
 });

 describe('initialize expandMode none', () => {
   it('should do nothing when open button pressed', async(() => {
     component.expandMode = 'none';
      fixture.detectChanges();
      triggerXsBreakpoint().then(() => {
        fixture.detectChanges();
        verifySearchOpenFullScreen();
        triggerOpenButton().then(() => {
          fixture.detectChanges();
          verifySearchOpenFullScreen();
        });
      });
   }));
 });
});
