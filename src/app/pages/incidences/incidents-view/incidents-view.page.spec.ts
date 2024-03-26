import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentsViewPage } from './incidents-view.page';

describe('IncidentsViewPage', () => {
  let component: IncidentsViewPage;
  let fixture: ComponentFixture<IncidentsViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidentsViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
