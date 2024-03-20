import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainStartPage } from './main-start.page';

describe('MainStartPage', () => {
  let component: MainStartPage;
  let fixture: ComponentFixture<MainStartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MainStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
