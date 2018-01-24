import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheRouterLinkDirective } from './link.directive';
import { StacheRouterLinkTestComponent } from './fixtures/link.component.fixture';
import { StacheNavService } from '../nav';

describe('StacheLinkDirective', () => {
  let component: StacheRouterLinkTestComponent;
  let debugElement: DebugElement;
  let directiveElement: any;
  let fixture: ComponentFixture<StacheRouterLinkTestComponent>;
  let mockNavService: any;
  let path: string;
  let fragment: string;

  class MockNavService {
    public navigate = jasmine.createSpy('navigate').and.callFake((routeObj: any) => {
      path = routeObj.path;
      fragment = routeObj.fragment;
    });
  }

  beforeEach(() => {
    mockNavService = new MockNavService();

    TestBed.configureTestingModule({
      declarations: [
        StacheRouterLinkDirective,
        StacheRouterLinkTestComponent
      ],
      providers: [
        { provide: StacheNavService, useValue: mockNavService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StacheRouterLinkTestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(StacheRouterLinkDirective));
    debugElement = fixture.debugElement;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a route input', () => {
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    expect(directiveInstance.stacheRouterLink).toBe('test-route');
  });

  it('should have a fragment input', () => {
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    expect(directiveInstance.fragment).toBe('test');
  });

  it('should call the navigate method when clicked', async(() => {
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    spyOn(directiveInstance, 'navigate');
    const link = debugElement.nativeElement.querySelector('a');
    link.click();
    fixture.whenStable()
      .then(() => {
        expect(directiveInstance.navigate).toHaveBeenCalled();
      });
  }));

  it('should pass the fragment to the navigate method if it exists', () => {
    const event = new Event('click');
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    directiveInstance.navigate(event);
    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: 'test'
    });
  });

  it('should not pass a fragment if it does not exist', () => {
    const event = new Event('click');
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    directiveInstance.fragment = undefined;
    directiveInstance.navigate(event);
    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: undefined
    });
  });
});
