import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionContractPage } from './gestion-contract.page';

describe('GestionContractPage', () => {
  let component: GestionContractPage;
  let fixture: ComponentFixture<GestionContractPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionContractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
