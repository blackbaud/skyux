import {
  Type
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  HelpInitComponent
} from './init-help.component';

import {
  HelpInitializationService
} from '../../public';

function fullSpyOnClass<T>(type: Type<T>): jasmine.SpyObj<T> {
  return jasmine.createSpyObj(type.name, Object.keys(type.prototype));
}

describe('HelpInitComponent', () => {
  let helpInitService: jasmine.SpyObj<HelpInitializationService>;

  beforeEach(() => {
    helpInitService = fullSpyOnClass(HelpInitializationService);

    TestBed.configureTestingModule({
      declarations: [HelpInitComponent],
      providers: [
        {provide: HelpInitializationService, useValue: helpInitService}
      ]
    });
  });

  it('should initialize the help widget on creation if it does not exist', () => {
    TestBed.createComponent(HelpInitComponent);
    expect(helpInitService.load).toHaveBeenCalled();
  });
});
