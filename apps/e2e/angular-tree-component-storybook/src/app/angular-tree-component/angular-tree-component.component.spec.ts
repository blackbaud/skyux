import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularTreeComponentComponent } from './angular-tree-component.component';
import { AngularTreeComponentModule } from './angular-tree-component.module';

describe('AngularTreeComponentComponent', () => {
  let component: AngularTreeComponentComponent;
  let fixture: ComponentFixture<AngularTreeComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularTreeComponentModule],
    });
    fixture = TestBed.createComponent(AngularTreeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
