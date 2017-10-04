import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { HelpInitComponent } from './init-help.component';
import { HelpInitializationService } from '../../public';

import { HelpWindowRef } from '../window-ref';

class MockWindowRef {
  public nativeWindow = {
    BBHELP: false
  };
}

describe('HelpInitComponent', () => {
  const helpInitService = new HelpInitializationService();
  let mockWindowRef: MockWindowRef;
  let component: HelpInitComponent;
  let fixture: ComponentFixture<HelpInitComponent>;

  beforeEach(() => {
    mockWindowRef = new MockWindowRef();
    spyOn(helpInitService, 'load').and.callFake((config: any) => { });

    TestBed.configureTestingModule({
      declarations: [
        HelpInitComponent
      ],
      providers: [
        {
          provide: HelpInitializationService,
          useValue: helpInitService
        },
        {
          provide: HelpWindowRef,
          useValue: mockWindowRef
        }
      ]
    })
      .compileComponents();
  });

  it('should initialize the help widget on creation if it doesn\'t exist', () => {
    fixture = TestBed.createComponent(HelpInitComponent);
    component = fixture.componentInstance;
    expect(helpInitService.load).toHaveBeenCalled();
  });

  it('should not try to call load if the widget already exists', () => {
    mockWindowRef.nativeWindow.BBHELP = true;
    fixture = TestBed.createComponent(HelpInitComponent);
    component = fixture.componentInstance;
    expect(helpInitService.load).not.toHaveBeenCalled();
  });
});
