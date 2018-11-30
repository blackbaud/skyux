import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyAppConfig
} from '@blackbaud/skyux-builder/runtime';

import {
  expect
} from '@blackbaud/skyux-lib-testing';

import {
  MyLibrarySampleComponent
} from './sample.component';

class MockSkyAppConfig {
  public runtime: any = {};
  public skyux: any = {
    appSettings: {
      myLibrary: {
        name: 'Library'
      }
    }
  };
}

describe('LibrarySampleComponent', () => {
  let component: MyLibrarySampleComponent;
  let fixture: ComponentFixture<MyLibrarySampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyLibrarySampleComponent
      ],
      providers: [
        {
          provide: SkyAppConfig,
          useClass: MockSkyAppConfig
        }
      ]
    });

    fixture = TestBed.createComponent(MyLibrarySampleComponent);
    component = fixture.componentInstance;
  });

  it('should output the name from config', () => {
    fixture.detectChanges();
    expect(component.appSettings.myLibrary.name).toBe('Library');
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeAccessible();
  }));
});
