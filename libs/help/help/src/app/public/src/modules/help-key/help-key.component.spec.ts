import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { HelpKeyComponent } from './help-key.component';
import { HelpWidgetService } from '../shared';

describe('HelpKeyComponent', () => {
  let component: HelpKeyComponent;
  let fixture: ComponentFixture<HelpKeyComponent>;
  let mockWidgetService: any;

  class MockWidgetService {
    public setCurrentHelpKey = jasmine.createSpy('setCurrentHelpKey').and.callFake(() => {});
    public setHelpKeyToDefault = jasmine.createSpy('setHelpKeyToDefault')
      .and.callFake(() => {});
  }

  beforeEach(() => {
    mockWidgetService = new MockWidgetService();

    TestBed.configureTestingModule({
      declarations: [
        HelpKeyComponent
      ],
      providers: [
        { provide: HelpWidgetService, useValue: mockWidgetService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HelpKeyComponent);
    component = fixture.componentInstance;
  });

  it('should call call the help service\'s setCurrentHelpKey method with its helpKey', () => {
    const testHelpKey = 'test-key.html';
    component.helpKey = testHelpKey;
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(testHelpKey);
  });

  it('should set the helpKey on the client to default when destroyed', () => {
    component.helpKey = 'HelpKey';
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(mockWidgetService.setHelpKeyToDefault).toHaveBeenCalled();
  });
});
