import {
  DebugElement
} from '@angular/core';
import {
  BrowserModule,
  By
} from '@angular/platform-browser';
import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '../media-queries';
import {
  MockSkyMediaQueryService
} from '../testing/mocks';

import {
  SkyActionButtonComponent,
  SkyActionButtonModule
} from '.';
import {
  ActionButtonTestComponent
} from './fixtures/action-button.component.fixture';

describe('Action button component', () => {
  let fixture: ComponentFixture<ActionButtonTestComponent>;
  let cmp: ActionButtonTestComponent;
  let el: HTMLElement;
  let debugElement: DebugElement;
  let mockMediaQueryService: MockSkyMediaQueryService;

  beforeEach(() => {

    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      declarations: [
        ActionButtonTestComponent
      ],
      imports: [
        BrowserModule,
        RouterTestingModule,
        SkyActionButtonModule
      ]
    });

    fixture = TestBed.overrideComponent(SkyActionButtonComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService
          }
        ]
      }
    })
    .createComponent(ActionButtonTestComponent);

    fixture = TestBed.createComponent(ActionButtonTestComponent);
    cmp = fixture.componentInstance as ActionButtonTestComponent;
    el = fixture.nativeElement as HTMLElement;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should see if there is a permalink url included as an input to the element', () => {
    let actionButton = el.querySelectorAll('.sky-action-button').item(1);
    expect(actionButton.tagName === 'a');
    expect(actionButton.getAttribute('href')).toBe('https://developer.blackbaud.com/skyux/components');
  });

  it('should see if there is a permalink route included as an input to the element', () => {
    let actionButton = el.querySelectorAll('.sky-action-button').item(2);
    expect(actionButton.tagName === 'a');
    expect(actionButton.getAttribute('href')).toBe('/?page=1#fragment');
  });

  it('should use a div element when permalink is not provided', () => {
    let actionButton = '.sky-action-button';
    expect(el.querySelectorAll(actionButton).item(0).tagName === 'div');
  });

  it('should transclude icon, header, and detail sections', () => {
    let iconContainer
      = '.sky-action-button-icon-header-container .sky-action-button-icon-container';
    let headerContainer = '.sky-action-button-icon-header-container .sky-action-button-header';
    let detailsContainer = '.sky-action-button sky-action-button-details';

    expect(el.querySelector(iconContainer)).not.toBeNull();

    expect(el.querySelector(headerContainer)).not.toBeNull();

    expect(el.querySelector(detailsContainer)).not.toBeNull();
  });

  it('should emit a click event on button click', () => {
    debugElement.query(By.css('.sky-action-button')).triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(true);
  });

  it('should emit a click event on enter press', () => {
    debugElement.query(By.css('.sky-action-button'))
      .triggerEventHandler('keydown.escape', { });
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(false);

    debugElement.query(By.css('.sky-action-button'))
      .triggerEventHandler('keydown.enter', { });
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(true);
  });

  it('should have a role of button and tabindex on the clickable area', () => {
    expect(debugElement.query(By.css('.sky-action-button')).attributes['role']).toBe('button');
    expect(debugElement.query(By.css('.sky-action-button')).attributes['tabindex']).toBe('0');
  });

  it('should display an icon based on iconType', () => {
    let iconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container i.fa-filter';
    expect(debugElement.query(By.css(iconSelector))).not.toBeNull();
  });

  it('should change icon size based on media breakpoints query', () => {
    let smallIconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container i.fa-2x';
    let largeIconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container i.fa-3x';
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expect(debugElement.query(By.css(smallIconSelector))).not.toBeNull();
    mockMediaQueryService.fire(SkyMediaBreakpoints.sm);
    fixture.detectChanges();
    expect(debugElement.query(By.css(largeIconSelector))).not.toBeNull();
  });

});
