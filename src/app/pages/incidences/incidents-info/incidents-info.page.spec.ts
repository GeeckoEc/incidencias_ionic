import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentsInfoPage } from './incidents-info.page';

describe('IncidentsInfoPage', () => {
  let component: IncidentsInfoPage;
  let fixture: ComponentFixture<IncidentsInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidentsInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
