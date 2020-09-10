import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserPage } from './show-user.page';

describe('ShowUserPage', () => {
  let component: ShowUserPage;
  let fixture: ComponentFixture<ShowUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
