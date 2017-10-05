import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { HelpKeyComponent } from './help-key.component';
import { HelpWidgetService } from '../shared';

describe('HelpKeyComponent', () => {
  let component: HelpKeyComponent;
  let fixture: ComponentFixture<HelpKeyComponent>;
  let mockWidgetService: any;

  class MockWidgetService {
    public setCurrentHelpKey = jasmine.createSpy('setCurrentHelpKey').and.callFake(() => { });
    public setHelpKeyToDefault = jasmine.createSpy('setHelpKeyToDefault').and.callFake(() => { });
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

  it('should call the help service\'s setCurrentHelpKey method with its helpKey', () => {
    const testHelpKey = 'test-key.html';
    component.helpKey = testHelpKey;
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(testHelpKey);
  });

  it('should call the setCurrentHelpKey method with the current helpKey on helpKey changes', () => {
    const testHelpKey1 = 'test-key1.html';
    const testHelpKey2 = 'test-key2.html';

    component.helpKey = testHelpKey1;
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(testHelpKey1);

    component.helpKey = testHelpKey2;
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(testHelpKey2);
  });

  it('should set the helpKey on the client to default when destroyed', () => {
    component.helpKey = 'HelpKey';
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(mockWidgetService.setHelpKeyToDefault).toHaveBeenCalled();
  });
});
