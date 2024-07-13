import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesPagosPage } from './reportes-pagos.page';

describe('ReportesPagosPage', () => {
  let component: ReportesPagosPage;
  let fixture: ComponentFixture<ReportesPagosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesPagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
