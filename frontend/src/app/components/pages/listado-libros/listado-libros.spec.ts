import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoLibros } from './listado-libros';

describe('ListadoLibros', () => {
  let component: ListadoLibros;
  let fixture: ComponentFixture<ListadoLibros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoLibros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoLibros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
