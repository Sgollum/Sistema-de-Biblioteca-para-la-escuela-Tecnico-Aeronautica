import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login'; // Importa la clase correcta

describe('LoginComponent', () => { // Usamos el nombre de clase correcto
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Si el componente es 'standalone' (lo normal en Angular moderno),
      // lo importamos directamente aquí.
      imports: [LoginComponent] 
    })
    .compileComponents(); 
    // Nota: en standalone, .compileComponents() a menudo es opcional,
    // pero lo dejamos por si acaso.

    // Usamos la clase correcta para crear el componente.
    fixture = TestBed.createComponent(LoginComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    // La prueba verifica que el componente se haya creado.
    expect(component).toBeTruthy();
  });
});
