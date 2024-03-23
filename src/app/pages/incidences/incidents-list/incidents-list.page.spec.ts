import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentsListPage } from './incidents-list.page';

describe('IncidentsListPage', () => {
  let component: IncidentsListPage;
  let fixture: ComponentFixture<IncidentsListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
