import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpWidgetService } from '../shared/widget.service';

import { HelpKeyComponent } from './help-key.component';
import { HelpKeyModule } from './help-key.module';

describe('HelpKeyComponent', () => {
  let component: HelpKeyComponent;
  let fixture: ComponentFixture<HelpKeyComponent>;
  let mockWidgetService: any;

  class MockWidgetService {
    public pageDefaultKey: string;
    public setCurrentHelpKey = jasmine
      .createSpy('setCurrentHelpKey')
      .and.callFake(() => {});
    public setPageDefaultKey = jasmine
      .createSpy('setPageDefaultKey')
      .and.callFake((helpKey: string) => {
        this.pageDefaultKey = helpKey;
      });
    public setHelpKeyToPageDefault = jasmine
      .createSpy('setHelpKeyToPageDefault')
      .and.callFake(() => {});
    public setHelpKeyToGlobalDefault = jasmine
      .createSpy('setHelpKeyToGlobalDefault')
      .and.callFake(() => {});
  }

  beforeEach(() => {
    mockWidgetService = new MockWidgetService();

    TestBed.configureTestingModule({
      imports: [HelpKeyModule],
      providers: [{ provide: HelpWidgetService, useValue: mockWidgetService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpKeyComponent);
    component = fixture.componentInstance;
  });

  it("should call the help service's setCurrentHelpKey when a helpKey is defined", () => {
    const testHelpKey = 'test-key.html';
    component.helpKey = testHelpKey;
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(
      testHelpKey
    );
  });

  it("should call the help service's setCurrentHelpKey method when the helpKey changes", () => {
    const testHelpKey1 = 'test-key1.html';
    const testHelpKey2 = 'test-key2.html';

    component.helpKey = testHelpKey1;
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(
      testHelpKey1
    );

    component.helpKey = testHelpKey2;
    fixture.detectChanges();
    expect(mockWidgetService.setCurrentHelpKey).toHaveBeenCalledWith(
      testHelpKey2
    );
  });

  it('should set the helpKey on the client to the globalDefault when destroyed', () => {
    component.helpKey = 'HelpKey';
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(mockWidgetService.setHelpKeyToGlobalDefault).toHaveBeenCalled();
  });

  it("should call the help services's setPageDefaultKey method when a pageDefaultKey is set", () => {
    const pageDefaultKey = 'default-key.html';
    expect(mockWidgetService.pageDefaultKey).toEqual(undefined);
    component.pageDefaultKey = pageDefaultKey;
    fixture.detectChanges();
    expect(mockWidgetService.setPageDefaultKey).toHaveBeenCalledWith(
      pageDefaultKey
    );
    expect(mockWidgetService.pageDefaultKey).toEqual(pageDefaultKey);
  });

  it("should only call the services's setPageDefaultKey both pageDefaultKey and helpKey are defined", () => {
    const pageKey = 'page-key.html';
    const pageDefaultKey = 'default-key.html';

    component.pageDefaultKey = pageDefaultKey;
    component.helpKey = pageKey;

    fixture.detectChanges();
    expect(mockWidgetService.setPageDefaultKey).toHaveBeenCalledWith(
      pageDefaultKey
    );
    expect(mockWidgetService.setCurrentHelpKey).not.toHaveBeenCalled();
    expect(mockWidgetService.pageDefaultKey).toEqual(pageDefaultKey);
  });

  it("ngOnDestroy should call the services's setHelpKeyToPageDefault when it is not the pageDefaultKey but one is defined.", () => {
    mockWidgetService.pageDefaultKey = 'default-key.html';
    const pageKey = 'page-key.html';

    component.helpKey = pageKey;
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(mockWidgetService.setHelpKeyToPageDefault).toHaveBeenCalled();
  });
});
