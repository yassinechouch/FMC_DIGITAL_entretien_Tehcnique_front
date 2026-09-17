import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxeList } from './taxe-list';

describe('TaxeList', () => {
  let component: TaxeList;
  let fixture: ComponentFixture<TaxeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxeList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
