import { By } from '@angular/platform-browser';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BBHelpDisableWidgetDirective } from './disable.directive';

import { HelpWidgetService } from '../shared';

import { HelpBBHelpTestComponent } from './fixtures/help.component.fixture';
import { DisableDirectiveFixturesModule } from './fixtures/disable-directive-fixtures.module';

class MockWidgetService {
  public disabledCount: number = 0;

  public disableWidget(): void {
    this.disabledCount++;
  }

  public enableWidget(): void {
    if (this.disabledCount > 0) {
      this.disabledCount--;
    }
  }
}

describe('bbHelpDisableWidget Directive', () => {
  let fixture: ComponentFixture<HelpBBHelpTestComponent>;
  let mockWidgetService: MockWidgetService;
  let directiveElement: any;

  beforeEach(() => {
    mockWidgetService = new MockWidgetService();

    TestBed.configureTestingModule({
      providers: [
        { provide: HelpWidgetService, useValue: mockWidgetService }
      ],
      imports: [
        DisableDirectiveFixturesModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpBBHelpTestComponent);
    directiveElement = fixture.debugElement.query(By.directive(BBHelpDisableWidgetDirective));
  });

  it('should call disableWidget on init when disableWidget is true ', () => {
    let directiveInstance = directiveElement.injector.get(BBHelpDisableWidgetDirective);
    spyOn(mockWidgetService, 'disableWidget').and.callThrough();
    directiveInstance.ngOnInit();
    expect(mockWidgetService.disableWidget).toHaveBeenCalled();
    expect(mockWidgetService.disabledCount).toEqual(1);
  });

  it('should call enableWidget on destroy when disabledWidget is true', () => {
    let directiveInstance = directiveElement.injector.get(BBHelpDisableWidgetDirective);
    spyOn(mockWidgetService, 'enableWidget').and.callThrough();
    directiveInstance.ngOnDestroy();
    expect(mockWidgetService.enableWidget).toHaveBeenCalled();
    expect(mockWidgetService.disabledCount).toEqual(0);
  });
});
