import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyModalService } from '@skyux/modals';

import { SkyModalLinkListComponent } from './modal-link-list.component';

describe('SkyModalLinkListComponent', () => {
  let component: SkyModalLinkListComponent;
  let fixture: ComponentFixture<SkyModalLinkListComponent>;
  let openModalSpy: jasmine.Spy;

  beforeEach(() => {
    openModalSpy = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [SkyModalLinkListComponent],
      providers: [
        {
          provide: SkyModalService,
          useValue: {
            open: openModalSpy,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(SkyModalLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.openModal({
      label: 'Link 1',
      modal: { component: '', config: {} },
    });
    expect(openModalSpy).toHaveBeenCalled();
  });

  it('should handle empty input', () => {
    expect(component).toBeTruthy();
    component.links = undefined;
    expect(component.links).toBeUndefined();
  });
});
