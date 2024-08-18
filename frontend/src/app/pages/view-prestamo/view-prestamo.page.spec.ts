import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPrestamoPage } from './view-prestamo.page';

describe('ViewPrestamoPage', () => {
  let component: ViewPrestamoPage;
  let fixture: ComponentFixture<ViewPrestamoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrestamoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
