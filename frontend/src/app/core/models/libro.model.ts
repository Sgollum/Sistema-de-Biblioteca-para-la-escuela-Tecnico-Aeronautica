export interface Libro {
    id: number;
    titulo: string;
    autor_nombre: string;
    categoria_nombre: string;
    isbn: string;
    copias_disponibles: number;
    imagen_url?: string; 
}