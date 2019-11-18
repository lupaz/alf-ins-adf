import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRevisionComponent } from './formulario-revision.component';

describe('FormularioRevisionComponent', () => {
  let component: FormularioRevisionComponent;
  let fixture: ComponentFixture<FormularioRevisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioRevisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
