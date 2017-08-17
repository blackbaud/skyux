import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { LibrarySampleComponent } from './sample.component';
import { LibraryConfigService } from '../shared';

class MockSkyAppConfig {
  public runtime: any = {};
  public skyux: any = {
    name: 'test',
    appSettings: {
      myLibrary: {
        name: 'library'
      }
    }
  };
}

describe('LibrarySampleComponent', () => {
  let component: LibrarySampleComponent;
  let fixture: ComponentFixture<LibrarySampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LibrarySampleComponent
      ],
      providers: [
        { provide: LibraryConfigService, useClass: MockSkyAppConfig }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrarySampleComponent);
    component = fixture.componentInstance;
  });

  it('should output the name from config', () => {
    fixture.detectChanges();
    expect(fixture).toExist();
    expect(component.configService.skyux.name).toBe('test');
    expect(component.configService.skyux.appSettings.myLibrary.name).toBe('library');
  });
});
