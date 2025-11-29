import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecarioDashboardComponent } from './bibliotecario-dashboard';

describe('BibliotecarioDashboard', () => {
  let component: BibliotecarioDashboardComponent;
  let fixture: ComponentFixture<BibliotecarioDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecarioDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecarioDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
