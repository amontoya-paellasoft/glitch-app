import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetasToDo } from './tarjetas-to-do';

describe('TarjetasToDo', () => {
  let component: TarjetasToDo;
  let fixture: ComponentFixture<TarjetasToDo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasToDo],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetasToDo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
