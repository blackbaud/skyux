import { TemplateRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAgGridCellRendererTemplateComponent } from './cell-renderer-template.component';

describe('SkyAgGridCellRendererTemplateComponent', () => {
  let component: SkyAgGridCellRendererTemplateComponent;
  let fixture: ComponentFixture<SkyAgGridCellRendererTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridCellRendererTemplateComponent],
    });
    fixture = TestBed.createComponent(SkyAgGridCellRendererTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render template', () => {
    expect(() => {
      component.agInit({
        data: { id: '1', name: 'test' },
        value: 'test',
        context: {},
        colDef: {
          cellRendererParams: {
            template: {} as TemplateRef<any>,
          },
        },
      } as any);
    }).not.toThrow();
    expect(() => {
      component.refresh({
        data: { id: '1', name: 'test' },
        value: 'test',
        context: {},
        colDef: {},
      } as any);
    }).not.toThrow();
  });

  it('should render template signal', () => {
    const template = signal<TemplateRef<unknown> | undefined>(undefined);
    expect(() => {
      component.agInit({
        data: { id: '1', name: 'test' },
        value: 'test',
        context: {},
        colDef: { cellRendererParams: { template } },
      } as any);
    }).not.toThrow();
    expect(() => {
      component.refresh({
        data: { id: '1', name: 'test' },
        value: 'test',
        context: {},
        colDef: {},
      } as any);
    }).not.toThrow();
  });
});
