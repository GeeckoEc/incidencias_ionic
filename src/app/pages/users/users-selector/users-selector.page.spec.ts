import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersSelectorPage } from './users-selector.page';

describe('UsersSelectorPage', () => {
  let component: UsersSelectorPage;
  let fixture: ComponentFixture<UsersSelectorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
