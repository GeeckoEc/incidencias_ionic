import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersInfoPage } from './users-info.page';

describe('UsersInfoPage', () => {
  let component: UsersInfoPage;
  let fixture: ComponentFixture<UsersInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
