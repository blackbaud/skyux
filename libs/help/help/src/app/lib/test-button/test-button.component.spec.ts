import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  DebugElement
} from '@angular/core';

import {
  TestButtonComponent
} from './test-button.component';

import {
  HelpWidgetService
} from '../../public/';

describe('TestButtonComponent', () => {
  let component: TestButtonComponent;
  let fixture: ComponentFixture<TestButtonComponent>;
  let debugElement: DebugElement;

  let mockWidgetService: any;

  class MockWidgetService {
    public openToHelpKey = jasmine.createSpy('openToHelpKey').and.callFake(() => { });
  }

  beforeEach(() => {
    mockWidgetService = new MockWidgetService();

    TestBed.configureTestingModule({
      declarations: [
        TestButtonComponent
      ],
      providers: [
        { provide: HelpWidgetService, useValue: mockWidgetService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestButtonComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('on click it should call the openWidget method on the service', () => {
    const helpKey = 'test-key.html';
    component.helpKey = helpKey;
    debugElement.query(By.css('.test-button-component')).triggerEventHandler('click', undefined);
    expect(mockWidgetService.openToHelpKey).toHaveBeenCalledWith(helpKey);
  });
});
