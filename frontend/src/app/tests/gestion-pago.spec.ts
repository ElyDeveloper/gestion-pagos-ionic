import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FormModels } from 'src/app/shared/utils/forms-models';
import { GestionPagoPage } from '../pages/gestion-pago/gestion-pago.page';
import { environment } from 'src/environments/environment';

describe('GestionPagoPage', () => {
  let component: GestionPagoPage;
  let fixture: ComponentFixture<GestionPagoPage>;
  let globalServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    globalServiceMock = jasmine.createSpyObj('GlobalService', ['GetIdDecrypted', 'Get', 'parseObjectDates', 'formatDateForInput']);
    activatedRouteMock = {
      paramMap: of({ get: () => '1' })
    };

    TestBed.configureTestingModule({
      declarations: [GestionPagoPage, LoaderComponent],
      providers: [
        FormBuilder,
        FormModels,
        { provide: GlobalService, useValue: globalServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });

    fixture = TestBed.createComponent(GestionPagoPage);
    component = fixture.componentInstance;
  });

  it('debería calcular la mora correctamente', () => {
    // Arreglar
    const mockMonto = 1000;
    const mockDaysLate = 5;
    const mockPercentage = 30;
    spyOnProperty(environment, 'percentage').and.returnValue(mockPercentage);
  
    // Actuar
    const mora = component.calculateMora(mockMonto, mockDaysLate);
  
    // Afirmar
    const moraEsperada = Number(((mockPercentage / 30) * mockMonto * (mockDaysLate / 30)).toFixed(2));
    expect(mora).toEqual(moraEsperada);
  });
});


