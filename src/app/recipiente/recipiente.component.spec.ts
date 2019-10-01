import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipienteComponent } from './recipiente.component';

describe('RecipienteComponent', () => {
  let component: RecipienteComponent;
  let fixture: ComponentFixture<RecipienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
