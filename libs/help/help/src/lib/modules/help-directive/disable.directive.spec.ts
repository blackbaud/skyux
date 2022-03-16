import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HelpModule } from '../help/help.module';
import { HelpWidgetService } from '../shared/widget.service';

import { BBHelpDisableWidgetDirective } from './disable.directive';
import { BBHelpDisableModule } from './disable.module';
import { HelpBBHelpTestComponent } from './fixtures/help.component.fixture';

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
      declarations: [HelpBBHelpTestComponent],
      providers: [{ provide: HelpWidgetService, useValue: mockWidgetService }],
      imports: [HelpModule, BBHelpDisableModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpBBHelpTestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(BBHelpDisableWidgetDirective)
    );
  });

  it('should call disableWidget on init when disableWidget is true ', () => {
    let directiveInstance = directiveElement.injector.get(
      BBHelpDisableWidgetDirective
    );
    spyOn(mockWidgetService, 'disableWidget').and.callThrough();
    directiveInstance.ngOnInit();
    expect(mockWidgetService.disableWidget).toHaveBeenCalled();
    expect(mockWidgetService.disabledCount).toEqual(1);
  });

  it('should call enableWidget on destroy when disabledWidget is true', () => {
    let directiveInstance = directiveElement.injector.get(
      BBHelpDisableWidgetDirective
    );
    spyOn(mockWidgetService, 'enableWidget').and.callThrough();
    directiveInstance.ngOnDestroy();
    expect(mockWidgetService.enableWidget).toHaveBeenCalled();
    expect(mockWidgetService.disabledCount).toEqual(0);
  });
});
