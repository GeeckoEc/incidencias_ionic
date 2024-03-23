import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentsFormPage } from './incidents-form.page';

describe('IncidentsFormPage', () => {
  let component: IncidentsFormPage;
  let fixture: ComponentFixture<IncidentsFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidentsFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
