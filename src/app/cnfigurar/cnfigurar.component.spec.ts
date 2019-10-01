import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfigurarComponent } from './cnfigurar.component';

describe('CnfigurarComponent', () => {
  let component: CnfigurarComponent;
  let fixture: ComponentFixture<CnfigurarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnfigurarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfigurarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
