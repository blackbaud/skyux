import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyModalConfiguration,
  SkyModalHostService,
  SkyModalInstance
} from '@skyux/modals';

import {
  Observable
} from 'rxjs';

import {
  SkySelectFieldModule
} from './select-field.module';

import {
  SkySelectFieldPickerComponent
} from './select-field-picker.component';

import {
  SkySelectFieldPickerContext
} from './select-field-picker-context';

//#region helpers
class MockModalInstance {
  public saveResult: any;
  public cancelResult: any;
  public closeResult: any;
  public closeReason: any;

  constructor() {}

  public save(result: any): void {
    this.saveResult = result;
  }

  public cancel(result: any): void {
    this.cancelResult = result;
  }

  public close(result: any, reason: string): void {
    this.closeResult = result;
    this.closeReason = reason;
  }
}

class MockModalHostService {
  constructor() {}

  public getModalZIndex(): void {}
  public onClose(): void {}
}

class MockModalConfiguration {
  public fullPage: boolean;
  constructor() {}
}
//#endregion

describe('select field picker component', () => {
  let component: SkySelectFieldPickerComponent;
  let fixture: ComponentFixture<SkySelectFieldPickerComponent>;
  let context: SkySelectFieldPickerContext;
  context = {
    data: Observable.of([]),
    inMemorySearchEnabled: false,
    showAddNewRecordButton: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SkySelectFieldPickerContext, useValue: context },
        { provide: SkyModalInstance, useValue: new MockModalInstance() },
        { provide: SkyModalHostService, useValue: new MockModalHostService() },
        { provide: SkyModalConfiguration, useValue: new MockModalConfiguration() }
      ],
      imports: [
        SkySelectFieldModule
      ]
    });
  });

  it('should set inMemorySearchEnabled to true when the corresponding context property is undefined', () => {
    context.inMemorySearchEnabled = undefined;

    fixture = TestBed.createComponent(SkySelectFieldPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.inMemorySearchEnabled).toEqual(true);
  });

  it('should set inMemorySearchEnabled to false when the corresponding context property is false', () => {
    context.inMemorySearchEnabled = false;

    fixture = TestBed.createComponent(SkySelectFieldPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.inMemorySearchEnabled).toEqual(false);
  });

  it('should set inMemorySearchEnabled to true when the corresponding context property is true', () => {
    context.inMemorySearchEnabled = true;

    fixture = TestBed.createComponent(SkySelectFieldPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.inMemorySearchEnabled).toEqual(true);
  });
});
