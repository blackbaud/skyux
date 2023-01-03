import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipLinkComponent } from './skip-link.component';
import { SkipLinkModule } from './skip-link.module';

describe('SkipLinkComponent', () => {
  let component: SkipLinkComponent;
  let fixture: ComponentFixture<SkipLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkipLinkModule],
    });
    fixture = TestBed.createComponent(SkipLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
