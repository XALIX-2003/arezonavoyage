import os
from app import app, db, User


def create_admin():
    with app.app_context():
        db.create_all()
        # Afficher le chemin absolu du fichier SQLite utilisé
        db_path = db.engine.url.database
        print(f"Base SQLite utilisée : {os.path.abspath(db_path)}")
        from sqlalchemy import inspect
        tables = inspect(db.engine).get_table_names()
        print(f"Tables créées : {tables}")
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin = User(username='admin', is_admin=True)
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('Admin user created: admin / admin123')
        else:
            print('Admin user already exists.')

if __name__ == '__main__':
    create_admin()
