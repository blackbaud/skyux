import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  HelpWidgetService
} from '../shared/widget.service';

import {
  HelpModule
} from '../help/help.module';

import {
  HelpBBHelpTestComponent
} from './fixtures/help.component.fixture';

import {
  OpenOnClickDirectiveModule
} from './open-on-click.module';

class MockWidgetService {
  public openWidget(helpKey: string): void { }
}

describe('bbHelpDisableWidget Directive', () => {
  let fixture: ComponentFixture<HelpBBHelpTestComponent>;
  let mockWidgetService: MockWidgetService;

  beforeEach(() => {
    mockWidgetService = new MockWidgetService();

    TestBed.configureTestingModule({
      declarations: [
        HelpBBHelpTestComponent
      ],
      providers: [
        { provide: HelpWidgetService, useValue: mockWidgetService }
      ],
      imports: [
        HelpModule,
        OpenOnClickDirectiveModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpBBHelpTestComponent);
  });

  it('should call the widget service open method with a helpKey on click', fakeAsync(() => {
    let aTag = fixture.debugElement.nativeElement.querySelector('a');
    let openSpy = spyOn(mockWidgetService, 'openWidget').and.callThrough();
    fixture.detectChanges();
    aTag.click();
    fixture.whenStable().then(() => {
      expect(openSpy).toHaveBeenCalledWith('foo.html');
    });
  }));

  it('should call the widget service open method on enter keypress', fakeAsync(() => {
    fixture.detectChanges();

    let aTag = fixture.debugElement.nativeElement.querySelector('a');
    let openSpy = spyOn(mockWidgetService, 'openWidget').and.callThrough();

    SkyAppTestUtility.fireDomEvent(aTag, 'keydown', {
      keyboardEventInit: {
        key: 'Enter'
      }
    });

    fixture.detectChanges();
    tick();

    expect(openSpy).toHaveBeenCalledWith('foo.html');
  }));

  it('should not call the widget service open method on other keypresses', fakeAsync(() => {
    let aTag = fixture.debugElement.nativeElement.querySelector('a');
    let openSpy = spyOn(mockWidgetService, 'openWidget').and.callThrough();

    SkyAppTestUtility.fireDomEvent(aTag, 'keydown', {
      keyboardEventInit: {
        key: 'Tab'
      }
    });

    fixture.detectChanges();
    tick();

    expect(openSpy).not.toHaveBeenCalled();
  }));
});
