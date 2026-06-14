import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarLibro } from './registrar-libro';

describe('RegistrarLibro', () => {
  let component: RegistrarLibro;
  let fixture: ComponentFixture<RegistrarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarLibro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarLibro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
