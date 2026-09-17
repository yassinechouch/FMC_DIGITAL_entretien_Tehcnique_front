import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxeForm } from './taxe-form';

describe('TaxeForm', () => {
  let component: TaxeForm;
  let fixture: ComponentFixture<TaxeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
