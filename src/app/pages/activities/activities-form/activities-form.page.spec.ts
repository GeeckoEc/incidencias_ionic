import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesFormPage } from './activities-form.page';

describe('ActivitiesFormPage', () => {
  let component: ActivitiesFormPage;
  let fixture: ComponentFixture<ActivitiesFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivitiesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
