import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFallasComponent } from './listar-fallas.component';

describe('ListarFallasComponent', () => {
  let component: ListarFallasComponent;
  let fixture: ComponentFixture<ListarFallasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarFallasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
