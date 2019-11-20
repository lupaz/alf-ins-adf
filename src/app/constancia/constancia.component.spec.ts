import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstanciaComponent } from './constancia.component';

describe('ConstanciaComponent', () => {
  let component: ConstanciaComponent;
  let fixture: ComponentFixture<ConstanciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
