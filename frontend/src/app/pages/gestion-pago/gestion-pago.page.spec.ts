import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionPagoPage } from './gestion-pago.page';

describe('GestionPagoPage', () => {
  let component: GestionPagoPage;
  let fixture: ComponentFixture<GestionPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
