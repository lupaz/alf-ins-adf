import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedorGeneralComponent } from './contenedor-general.component';

describe('ContenedorGeneralComponent', () => {
  let component: ContenedorGeneralComponent;
  let fixture: ComponentFixture<ContenedorGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenedorGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenedorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
