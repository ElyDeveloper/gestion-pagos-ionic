import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewFilesPage } from './view-files.page';

describe('ViewFilesPage', () => {
  let component: ViewFilesPage;
  let fixture: ComponentFixture<ViewFilesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
