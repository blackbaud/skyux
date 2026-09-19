import { TestBed } from '@angular/core/testing';
import {
  provideSkyUserEventListener,
  SkyUserEventListener,
} from './instrumentation';

class MyUserEventListener implements SkyUserEventListener {}

describe('instrumentation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyUserEventListener(MyUserEventListener)],
    });
  });
});
