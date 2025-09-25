
# --- IMPORTS & INITIALISATION ---
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.orm import relationship

# --- CONFIGURATION ---
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), 'instance/database.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# --- MODELS (VERSION CORRIGÉE ET COMPLÈTE) ---

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    def set_password(self, password): self.password_hash = generate_password_hash(password)
    def check_password(self, password): return check_password_hash(self.password_hash, password)

class Destination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    images = relationship('Image', backref='destination', lazy='dynamic', cascade="all, delete-orphan")
    programmes = relationship('Programme', backref='destination', lazy='dynamic', cascade="all, delete-orphan")

class Programme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)
    available_dates = relationship('AvailableDate', backref='programme', lazy='dynamic', cascade="all, delete-orphan")

class AvailableDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    programme_id = db.Column(db.Integer, db.ForeignKey('programme.id'), nullable=False)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activity.id'), nullable=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.id'), nullable=True)

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

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telephone = db.Column(db.String(50), nullable=True)
    ville = db.Column(db.String(100), nullable=True)
    destination = db.Column(db.String(255), nullable=True)
    prix = db.Column(db.Float, nullable=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    program_title = db.Column(db.String(255), nullable=False)
    selected_date = db.Column(db.String(50), nullable=False)
    travelers = db.Column(db.Text, nullable=False) # Store as JSON string
    specific_request = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --- HELPERS ---
def is_admin(request):
    # TEMPORARY: This function is a security vulnerability and should be replaced with proper authentication.
    # For now, we're making it always return True to test other functionalities.
    return True

# --- ROUTES PUBLIQUES ---
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- ROUTE DE RÉSERVATION ---
@app.route('/api/book', methods=['POST', 'OPTIONS'])
def book_program():
    if request.method == 'OPTIONS': return jsonify(status='ok')
    data = request.get_json()
    if not data: return jsonify({"error": "Invalid data"}), 400
    
    travelers_data = data.get('travelers', [])
    destination = data.get('programTitle')
    prix = data.get('price')
    for traveler in travelers_data:
        new_client = Client(
            nom=traveler.get('nom'),
            prenom=traveler.get('prenom'),
            email=traveler.get('email'),
            telephone=traveler.get('telephone'),
            ville=traveler.get('ville'),
            destination=destination,
            prix=prix
        )
        db.session.add(new_client)
    try:
        db.session.commit()
        return jsonify({"success": True, "message": "Booking and clients processed!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# --- ROUTES ADMIN ---

@app.route('/api/admin/login', methods=['POST', 'OPTIONS'])
def admin_login():
    if request.method == 'OPTIONS': return jsonify(status='ok')
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        if user.is_admin:
            return jsonify({"success": True, "message": "Login successful!", "is_admin": True})
        else:
            return jsonify({"error": "User is not an admin.", "is_admin": False}), 403
    return jsonify({"error": "Invalid credentials", "is_admin": False}), 401

@app.route('/api/admin/check_admin_status', methods=['GET'])
def check_admin_status():
    user = User.query.filter_by(username='admin').first()
    if user:
        return jsonify({"username": user.username, "is_admin": user.is_admin, "password_hash_exists": bool(user.password_hash)}), 200
    else:
        return jsonify({"message": "Admin user not found"}), 404

@app.route('/api/debug/admin_user', methods=['GET'])
def debug_admin_user():
    user = User.query.filter_by(username='admin').first()
    if user:
        return jsonify({
            "username": user.username,
            "is_admin": user.is_admin,
            "password_hash_exists": bool(user.password_hash),
            "password_hash_value_for_debug": user.password_hash # For debugging, do NOT keep in production
        }), 200
    else:
        return jsonify({"message": "Admin user not found in DB"}), 404

@app.route('/api/admin/clients', methods=['GET', 'OPTIONS'])
def get_clients():
    if request.method == 'OPTIONS': return ('', 204)
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    clients = Client.query.all()
    return jsonify([{'id': c.id, 'nom': c.nom, 'prenom': c.prenom, 'email': c.email, 'telephone': c.telephone, 'ville': c.ville} for c in clients])

@app.route('/api/admin/clients/<int:client_id>', methods=['DELETE', 'OPTIONS'])
def delete_client(client_id):
    if request.method == 'OPTIONS': return ('', 204)
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify(success=True)


@app.route('/api/admin/destinations/<int:dest_id>/programmes', methods=['GET'])
def get_programmes_for_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    programmes = destination.programmes.all()
    result = []
    for p in programmes:
        dates = p.available_dates.all()
        result.append({
            'id': p.id, 
            'title': p.title, 
            'description': p.description, 
            'price': p.price,
            'available_dates': [{'id': d.id, 'date': d.date.isoformat()} for d in dates]
        })
    return jsonify(result)

@app.route('/api/admin/programmes', methods=['POST'])
def create_programme():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    destination_id = data.get('destination_id')
    title = data.get('title')

    if not destination_id:
        return jsonify({"error": "destination_id is required"}), 400
    if not title:
        return jsonify({"error": "title is required"}), 400

    prog = Programme(
        destination_id=destination_id, 
        title=title, 
        description=data.get('description'), 
        price=data.get('price')
    )
    db.session.add(prog)
    db.session.commit()
    return jsonify({'id': prog.id}), 201

@app.route('/api/admin/programmes/<int:prog_id>', methods=['DELETE'])
def delete_programme(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    prog = Programme.query.get_or_404(prog_id)
    db.session.delete(prog)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/destinations/<int:dest_id>/images', methods=['GET'])
def get_images_for_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    images = destination.images.all()
    return jsonify([{'id': i.id, 'url': i.url} for i in images])


def get_images_for_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    images = destination.images.all()
    return jsonify([{'id': i.id, 'url': i.url} for i in images])

# --- CRUD AvailableDate ---
@app.route('/api/admin/programmes/<int:prog_id>/dates', methods=['POST'])
def create_date_for_programme(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    data = request.get_json()
    date_str = data.get('date')
    if not date_str:
        return jsonify({'error': 'Date is required'}), 400
    
    # Convert string YYYY-MM-DD to date object
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format, use YYYY-MM-DD'}), 400

    new_date = AvailableDate(date=date_obj, programme_id=prog_id)
    db.session.add(new_date)
    db.session.commit()
    return jsonify({'id': new_date.id}), 201

@app.route('/api/admin/available_dates/<int:date_id>', methods=['DELETE'])
def delete_available_date(date_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    date_to_delete = AvailableDate.query.get_or_404(date_id)
    db.session.delete(date_to_delete)
    db.session.commit()
    return jsonify({'success': True})

# --- CRUD Hotel ---
@app.route('/api/admin/hotels', methods=['GET'])
def get_hotels():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    hotels = Hotel.query.all()
    # Note: This is a simplified return. You might want to include destination info.
    return jsonify([{'id': h.id, 'name': h.name, 'description': h.description, 'destination_id': h.destination_id} for h in hotels])

@app.route('/api/admin/hotels', methods=['POST'])
def create_hotel():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    name = data.get('name')
    destination_id = data.get('destination_id')

    if not name:
        return jsonify({"error": "name is required"}), 400
    if not destination_id:
        return jsonify({"error": "destination_id is required"}), 400

    hotel = Hotel(
        name=name, 
        description=data.get('description'),
        destination_id=destination_id
    )
    db.session.add(hotel)
    db.session.commit()
    return jsonify({'id': hotel.id}), 201

@app.route('/api/admin/hotels/<int:hotel_id>', methods=['DELETE'])
def delete_hotel(hotel_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    hotel = Hotel.query.get_or_404(hotel_id)
    db.session.delete(hotel)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/hotels/<int:hotel_id>/images', methods=['GET'])
def get_images_for_hotel(hotel_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    hotel = Hotel.query.get_or_404(hotel_id)
    images = hotel.images.all()
    return jsonify([{'id': i.id, 'url': i.url} for i in images])

# --- CRUD Activity ---
@app.route('/api/admin/activities', methods=['GET'])
def get_activities():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    activities = Activity.query.all()
    return jsonify([{'id': a.id, 'name': a.name, 'description': a.description, 'destination_id': a.destination_id} for a in activities])

@app.route('/api/admin/activities', methods=['POST'])
def create_activity():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    name = data.get('name')
    destination_id = data.get('destination_id')

    if not name:
        return jsonify({"error": "name is required"}), 400
    if not destination_id:
        return jsonify({"error": "destination_id is required"}), 400

    activity = Activity(
        name=name, 
        description=data.get('description'),
        destination_id=destination_id
    )
    db.session.add(activity)
    db.session.commit()
    return jsonify({'id': activity.id}), 201

@app.route('/api/admin/activities/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    activity = Activity.query.get_or_404(activity_id)
    db.session.delete(activity)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/activities/<int:activity_id>/images', methods=['GET'])
def get_images_for_activity(activity_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    activity = Activity.query.get_or_404(activity_id)
    images = activity.images.all()
    return jsonify([{'id': i.id, 'url': i.url} for i in images])

# --- MAIN EXECUTION ---
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
