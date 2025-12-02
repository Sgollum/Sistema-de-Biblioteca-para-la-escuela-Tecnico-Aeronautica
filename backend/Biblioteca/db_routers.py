# backend/Biblioteca/db_routers.py

class MicroserviceRouter:
    """
    Un router para controlar qué operaciones de base de datos van 
    a qué base de datos, basándose en la aplicación a la que pertenece el modelo.
    """
    
    # 🚨 DICCIONARIO CLAVE: Define la asignación de App a DB
    route_app_labels = {
        'MS_Usuarios': 'default',        
        'MS_Catalogo': 'catalogo_db',    
        'MS_Prestamos': 'prestamos_db',   # <--- ¡ESTA ES LA LÍNEA CLAVE!
        'MS_Reportes': 'default',        # Asumimos que usa la de Usuarios, o crea una propia
        
        # Apps Core de Django
        'admin': 'default',
        'auth': 'default',
        'contenttypes': 'default',
        'sessions': 'default',
    }

    def db_for_read(self, model, **hints):
        """Asigna operaciones de LECTURA a la base de datos de la app."""
        app_label = model._meta.app_label
        return self.route_app_labels.get(app_label) # Usa la conexión del diccionario

    def db_for_write(self, model, **hints):
        """Asigna operaciones de ESCRITURA a la base de datos de la app."""
        app_label = model._meta.app_label
        return self.route_app_labels.get(app_label) # Usa la conexión del diccionario

    def allow_relation(self, obj1, obj2, **hints):
        """
        Permite las relaciones si están en la misma DB o si son relaciones
        inter-DB permitidas (como Prestamos a Catalogo).
        """
        db_obj1 = self.route_app_labels.get(obj1._meta.app_label)
        db_obj2 = self.route_app_labels.get(obj2._meta.app_label)
        
        # Permite relaciones si ambos están en la misma DB
        if db_obj1 and db_obj1 == db_obj2:
            return True
        
        # CRÍTICO: Permite la relación (sin restricción SQL)
        # entre Prestamos y Catalogo, ya que sus IDs se gestionan vía API.
        if obj1._meta.app_label == 'MS_Prestamos' and obj2._meta.app_label == 'MS_Catalogo':
            return True
            
        return None # El resto de las relaciones inter-DB no están permitidas

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Controla si la migración de una app debe aplicarse a una DB específica.
        """
        if app_label in self.route_app_labels:
            # Si la app está en nuestra lista, solo se aplica a su DB asignada.
            return self.route_app_labels.get(app_label) == db
        
        # Para el resto (apps core de Django), solo se migran a 'default'.
        return db == 'default'