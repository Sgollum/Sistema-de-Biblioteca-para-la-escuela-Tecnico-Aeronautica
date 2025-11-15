import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecarioDashboard } from './bibliotecario-dashboard';

describe('BibliotecarioDashboard', () => {
  let component: BibliotecarioDashboard;
  let fixture: ComponentFixture<BibliotecarioDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecarioDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecarioDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
