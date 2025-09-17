# --- ROUTE LOGIN ADMIN ---
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        if user.is_admin:
            return jsonify({"success": True, "message": "Login successful!", "is_admin": True}), 200
        else:
            return jsonify({"error": "User is not an admin."}), 403
    else:
        return jsonify({"error": "Invalid username or password."}), 401


# --- IMPORTS & INITIALISATION ---
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json
from openpyxl import Workbook
from io import BytesIO
from sqlalchemy.orm import relationship

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), 'instance/database.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'



import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json
from openpyxl import Workbook
from io import BytesIO


# --- Helper: Vérification admin ---
def is_admin(request):
    data = request.get_json() or request.args
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    return user and user.is_admin
# --- CRUD Destination ---
@app.route('/api/admin/destinations', methods=['GET'])
def get_destinations():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    destinations = Destination.query.all()
    return jsonify([{'id': d.id, 'name': d.name, 'description': d.description} for d in destinations])

@app.route('/api/admin/destinations', methods=['POST'])
def add_destination():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    dest = Destination(name=data['name'], description=data.get('description', ''))
    db.session.add(dest)
    db.session.commit()
    return jsonify({'success': True, 'id': dest.id})

@app.route('/api/admin/destinations/<int:dest_id>', methods=['PUT'])
def update_destination(dest_id):
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    dest = Destination.query.get_or_404(dest_id)
    dest.name = data.get('name', dest.name)
    dest.description = data.get('description', dest.description)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/destinations/<int:dest_id>', methods=['DELETE'])
def delete_destination(dest_id):
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    dest = Destination.query.get_or_404(dest_id)
    db.session.delete(dest)
    db.session.commit()
    return jsonify({'success': True})
# --- CRUD Client ---
@app.route('/api/admin/clients', methods=['GET'])
def get_clients():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    clients = Client.query.all()
    return jsonify([
        {'id': c.id, 'nom': c.nom, 'prenom': c.prenom, 'email': c.email, 'telephone': c.telephone, 'ville': c.ville}
        for c in clients
    ])

@app.route('/api/admin/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'success': True})

# --- Export Excel des clients ---
@app.route('/api/admin/clients/export', methods=['GET'])
def export_clients():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    clients = Client.query.all()
    wb = Workbook()
    ws = wb.active
    ws.title = "Clients"
    ws.append(["ID", "Nom", "Prénom", "Email", "Téléphone", "Ville"])
    for c in clients:
        ws.append([c.id, c.nom, c.prenom, c.email, c.telephone, c.ville])
    excel_file = BytesIO()
    wb.save(excel_file)
    excel_file.seek(0)
    return send_file(excel_file,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True,
                     download_name='clients.xlsx')

import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json
from openpyxl import Workbook
from io import BytesIO



from sqlalchemy.orm import relationship

# --- Database Models ---

class Destination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    images = relationship('Image', backref='destination', lazy=True)

# --- Initialisation Flask/SQLAlchemy/CORS ---
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json
from openpyxl import Workbook
from io import BytesIO
from sqlalchemy.orm import relationship

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), 'instance/database.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Destination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    images = relationship('Image', backref='destination', lazy=True)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)
    images = relationship('Image', backref='activity', lazy=True)

class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)
    images = relationship('Image', backref='hotel', lazy=True)

class Programme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activity.id'), nullable=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.id'), nullable=True)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telephone = db.Column(db.String(50), nullable=True)
    ville = db.Column(db.String(100), nullable=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    program_title = db.Column(db.String(255), nullable=False)
    selected_date = db.Column(db.String(50), nullable=False)
    travelers = db.Column(db.Text, nullable=False) # Store as JSON string
    specific_request = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Booking {self.program_title} on {self.selected_date}>'

# --- ROUTES & LOGIC ---

def is_admin(request):
    data = request.get_json() or request.args
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    return user and user.is_admin

@app.route('/api/admin/destinations', methods=['GET'])
def get_destinations():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    destinations = Destination.query.all()
    return jsonify([{'id': d.id, 'name': d.name, 'description': d.description} for d in destinations])

@app.route('/api/admin/destinations', methods=['POST'])
def add_destination():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    dest = Destination(name=data['name'], description=data.get('description', ''))
    db.session.add(dest)
    db.session.commit()
    return jsonify({'success': True, 'id': dest.id})

@app.route('/api/admin/destinations/<int:dest_id>', methods=['PUT'])
def update_destination(dest_id):
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    dest = Destination.query.get_or_404(dest_id)
    dest.name = data.get('name', dest.name)
    dest.description = data.get('description', dest.description)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/destinations/<int:dest_id>', methods=['DELETE'])
def delete_destination(dest_id):
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    dest = Destination.query.get_or_404(dest_id)
    db.session.delete(dest)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/clients', methods=['GET'])
def get_clients():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    clients = Client.query.all()
    return jsonify([
        {'id': c.id, 'nom': c.nom, 'prenom': c.prenom, 'email': c.email, 'telephone': c.telephone, 'ville': c.ville}
        for c in clients
    ])

@app.route('/api/admin/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/clients/export', methods=['GET'])
def export_clients():
    if not is_admin(request):
        return jsonify({'error': 'Unauthorized'}), 403
    clients = Client.query.all()
    wb = Workbook()
    ws = wb.active
    ws.title = "Clients"
    ws.append(["ID", "Nom", "Prénom", "Email", "Téléphone", "Ville"])
    for c in clients:
        ws.append([c.id, c.nom, c.prenom, c.email, c.telephone, c.ville])
    excel_file = BytesIO()
    wb.save(excel_file)
    excel_file.seek(0)





# --- Main Execution ---

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            admin_user = User(username='admin', is_admin=True)
            admin_user.set_password('adminpass')
            db.session.add(admin_user)
            db.session.commit()
            print("Default admin user created: admin/adminpass")
    app.run(debug=True, port=5000)
