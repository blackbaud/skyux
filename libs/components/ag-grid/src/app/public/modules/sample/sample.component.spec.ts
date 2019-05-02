import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  MyLibrarySampleTestModule
} from './fixtures/sample.module.fixture';

import {
  MyLibrarySampleComponent
} from './sample.component';

describe('LibrarySampleComponent', () => {
  let component: MyLibrarySampleComponent;
  let fixture: ComponentFixture<MyLibrarySampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MyLibrarySampleTestModule
      ]
    });

    fixture = TestBed.createComponent(MyLibrarySampleComponent);
    component = fixture.componentInstance;
  });

  it('should output the name from config', () => {
    fixture.detectChanges();
    expect(component.appSettings.myLibrary.name).toBe('My Library');
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
