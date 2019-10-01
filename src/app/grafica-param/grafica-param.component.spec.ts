import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaParamComponent } from './grafica-param.component';

describe('GraficaParamComponent', () => {
  let component: GraficaParamComponent;
  let fixture: ComponentFixture<GraficaParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficaParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
