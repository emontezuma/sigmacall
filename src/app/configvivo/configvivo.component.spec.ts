import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigvivoComponent } from './configvivo.component';

describe('ConfigvivoComponent', () => {
  let component: ConfigvivoComponent;
  let fixture: ComponentFixture<ConfigvivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigvivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigvivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
