import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarStockComponent } from './actualizar-stock.component';

describe('ActualizarStock', () => {
  let component: ActualizarStockComponent;
  let fixture: ComponentFixture<ActualizarStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
