# backend/Biblioteca/db_routers.py

class MicroserviceRouter:
    """
    Un router para controlar qué operaciones de base de datos van 
    a qué base de datos, basándose en la aplicación a la que pertenece el modelo.
    """

    def db_for_read(self, model, **hints):
        """Lee operaciones desde la base de datos de la aplicación."""
        if model._meta.app_label == 'MS_Catalogo':
            return 'catalogo_db'
        if model._meta.app_label == 'MS_Usuarios':
            return 'default'
        return None

    def db_for_write(self, model, **hints):
        """Escribe operaciones a la base de datos de la aplicación."""
        if model._meta.app_label == 'MS_Catalogo':
            return 'catalogo_db'
        if model._meta.app_label == 'MS_Usuarios':
            return 'default'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """Permite relaciones si ambos objetos están en la misma base de datos."""
        db_catalogo = ['MS_Catalogo']
        db_usuarios = ['MS_Usuarios']

        if obj1._meta.app_label in db_catalogo and obj2._meta.app_label in db_catalogo:
            return True
        if obj1._meta.app_label in db_usuarios and obj2._meta.app_label in db_usuarios:
            return True
        # Las relaciones entre Microservicios (cross-db) no están permitidas por defecto
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Asegura que las migraciones vayan a la base de datos correcta."""
        if app_label == 'MS_Catalogo':
            return db == 'catalogo_db'
        if app_label == 'MS_Usuarios':
            return db == 'default'
        
        # Las aplicaciones core de Django (admin, auth, etc.) van a 'default'
        return db == 'default'