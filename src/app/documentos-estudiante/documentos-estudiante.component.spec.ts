import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosEstudianteComponent } from './documentos-estudiante.component';

describe('DocumentosEstudianteComponent', () => {
  let component: DocumentosEstudianteComponent;
  let fixture: ComponentFixture<DocumentosEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
