import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratosPagoPage } from './contratos-pago.page';

describe('ContratosPagoPage', () => {
  let component: ContratosPagoPage;
  let fixture: ComponentFixture<ContratosPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratosPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
