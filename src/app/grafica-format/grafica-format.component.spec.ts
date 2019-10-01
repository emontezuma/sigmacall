import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaFormatComponent } from './grafica-format.component';

describe('GraficaFormatComponent', () => {
  let component: GraficaFormatComponent;
  let fixture: ComponentFixture<GraficaFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficaFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
