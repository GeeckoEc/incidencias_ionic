import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidencesSummaryPage } from './incidences-summary.page';

describe('IncidencesSummaryPage', () => {
  let component: IncidencesSummaryPage;
  let fixture: ComponentFixture<IncidencesSummaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidencesSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
