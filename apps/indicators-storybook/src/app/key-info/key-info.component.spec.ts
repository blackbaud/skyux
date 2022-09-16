import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyInfoComponent } from './key-info.component';
import { KeyInfoModule } from './key-info.module';

describe('KeyInfoComponent', () => {
  let component: KeyInfoComponent;
  let fixture: ComponentFixture<KeyInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyInfoModule],
    });
    fixture = TestBed.createComponent(KeyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
