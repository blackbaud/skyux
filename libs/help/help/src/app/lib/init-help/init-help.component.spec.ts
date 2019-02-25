import { TestBed } from '@angular/core/testing';

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
    TestBed.createComponent(HelpInitComponent);
    expect(helpInitService.load).toHaveBeenCalled();
  });

  it('should not try to call load if the widget already exists', () => {
    mockWindowRef.nativeWindow.BBHELP = true;
    TestBed.createComponent(HelpInitComponent);
    expect(helpInitService.load).not.toHaveBeenCalled();
  });
});
