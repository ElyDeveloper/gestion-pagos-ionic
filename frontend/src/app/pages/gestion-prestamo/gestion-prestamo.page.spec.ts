import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionPrestamoPage } from './gestion-prestamo.page';

describe('GestionPrestamoPage', () => {
  let component: GestionPrestamoPage;
  let fixture: ComponentFixture<GestionPrestamoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPrestamoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
