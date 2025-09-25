# --- IMPORTS & INITIALISATION ---
import os
import uuid
from flask import Flask, request, jsonify, send_from_directory, send_file
import io
from openpyxl import Workbook
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.orm import relationship

# --- CONFIGURATION ---
app = Flask(__name__)

# Ensure the instance folder exists
instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
os.makedirs(instance_path, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

class ProgramDay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    programme_id = db.Column(db.Integer, db.ForeignKey('programme.id'), nullable=False)

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
    program_days = relationship('ProgramDay', backref='programme', lazy='dynamic', cascade="all, delete-orphan")
    available_dates = relationship('AvailableDate', backref='programme', lazy='dynamic', cascade="all, delete-orphan")

class AvailableDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    programme_id = db.Column(db.Integer, db.ForeignKey('programme.id'), nullable=False)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)
    images = relationship('Image', backref='activity', lazy=True)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activity.id'), nullable=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.id'), nullable=True)

class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    programme_id = db.Column(db.Integer, db.ForeignKey('programme.id'), nullable=True)
    programme = relationship('Programme', backref='hotels_in_programme')
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
    travelers = db.Column(db.Text, nullable=False)
    specific_request = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --- HELPERS ---
def is_admin(request):
    return True

# --- ROUTES PUBLIQUES ---
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- ROUTES PUBLIQUES (données) ---

@app.route('/api/hotels/<int:hotel_id>', methods=['GET'])
def get_public_hotel_detail(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    images = [img.url for img in hotel.images]
    return jsonify({
        'id': hotel.id,
        'name': hotel.name,
        'description': hotel.description,
        'images': images,
        'programme_id': hotel.programme_id
    })

@app.route('/api/hotels', methods=['GET'])
def get_public_hotels():
    hotels = Hotel.query.all()
    result = []
    for h in hotels:
        program_name = h.programme.title if h.programme else 'N/A'
        destination_name = h.programme.destination.name if h.programme and h.programme.destination else 'N/A'
        result.append({
            'id': h.id,
            'name': h.name,
            'description': h.description,
            'image': h.images[0].url if h.images else None,
            'programme_id': h.programme_id,
            'programme_name': program_name,
            'destination_name': destination_name
        })
    return jsonify(result)

@app.route('/api/destinations', methods=['GET'])
def get_public_destinations():
    destinations = Destination.query.all()
    result = []
    for d in destinations:
        first_image = d.images.first()
        image_url = first_image.url if first_image else None
        result.append({
            'id': d.id, 
            'name': d.name, 
            'description': d.description,
            'image': image_url,
            'images': [img.url for img in d.images.all()]
        })
    return jsonify(result)

@app.route('/api/destinations/<int:dest_id>', methods=['GET'])
def get_public_destination_detail(dest_id):
    try:
        destination = Destination.query.get_or_404(dest_id)
        programmes = []
        for p in destination.programmes.all():
            try:
                programmes.append({
                    'id': p.id,
                    'title': p.title,
                    'description': p.description,
                    'price': p.price,
                    'program_days': [{'day_number': d.day_number, 'title': d.title, 'description': d.description} for d in p.program_days.order_by(ProgramDay.day_number).all()],
                    'available_dates': [d.date.isoformat() for d in p.available_dates.order_by(AvailableDate.date).all() if d.date],
                    'hotels': [{'id': h.id, 'name': h.name, 'description': h.description, 'image': h.images[0].url if h.images else None} for h in p.hotels_in_programme]
                })
            except Exception as e:
                print(f"Error processing program {p.id}: {e}")
        images = [img.url for img in destination.images.all()]
        return jsonify({
            'id': destination.id,
            'name': destination.name,
            'description': destination.description,
            'images': images,
            'programmes': programmes,
        })
    except Exception as e:
        print(f"FATAL error on destination {dest_id}: {e}")
        return jsonify({"error": "A fatal error occurred on the server."}), 500


@app.route('/api/programmes', methods=['GET'])
def get_public_programmes():
    programmes = Programme.query.all()
    result = []
    for p in programmes:
        dest_image = None
        if p.destination and p.destination.images.first():
            dest_image = p.destination.images.first().url
        result.append({
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'price': p.price,
            'destination_name': p.destination.name if p.destination else 'N/A',
            'image': dest_image or '/uploads/placeholder.png',
            'available_dates': [d.date.isoformat() for d in p.available_dates.order_by(AvailableDate.date).all() if d.date],
            'hotels': [{'id': h.id, 'name': h.name, 'description': h.description, 'image': h.images[0].url if h.images else None} for h in p.hotels_in_programme]
        })
    return jsonify(result)

@app.route('/api/programmes/<int:prog_id>', methods=['GET'])
def get_public_programme_detail(prog_id):
    programme = Programme.query.get_or_404(prog_id)
    days = programme.program_days.order_by(ProgramDay.day_number).all()
    dates = programme.available_dates.order_by(AvailableDate.date).all()
    dest_image = None
    if programme.destination and programme.destination.images.first():
        dest_image = programme.destination.images.first().url
    return jsonify({
        'id': programme.id,
        'title': programme.title,
        'description': programme.description,
        'price': programme.price,
        'image': dest_image or '/uploads/placeholder.png',
        'program_days': [{'day_number': d.day_number, 'title': d.title, 'description': d.description} for d in days],
        'available_dates': [d.date.isoformat() for d in dates],
        'hotels': [{'id': h.id, 'name': h.name, 'description': h.description, 'image': h.images[0].url if h.images else None} for h in programme.hotels_in_programme]
    })


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

@app.route('/api/admin/destinations', methods=['GET'])
def get_destinations():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destinations = Destination.query.all()
    return jsonify([{'id': d.id, 'name': d.name, 'description': d.description} for d in destinations])

@app.route('/api/admin/destinations/<int:dest_id>', methods=['GET'])
def get_destination_detail(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    return jsonify({
        'id': destination.id,
        'name': destination.name,
        'description': destination.description
    })

@app.route('/api/admin/destinations', methods=['POST'])
def create_destination():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    name = request.form.get('name')
    description = request.form.get('description')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    new_dest = Destination(name=name, description=description)
    db.session.add(new_dest)
    files = request.files.getlist('images')
    for file in files:
        if file and file.filename:
            ext = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            filename = secure_filename(unique_filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            url = f'/uploads/{filename}'
            image = Image(url=url, destination_id=new_dest.id)
            db.session.add(image)
    db.session.commit()
    return jsonify({'id': new_dest.id, 'name': new_dest.name}), 201

@app.route('/api/admin/destinations/<int:dest_id>', methods=['PUT'])
def update_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    data = request.get_json()
    destination.name = data.get('name', destination.name)
    destination.description = data.get('description', destination.description)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/destinations/<int:dest_id>', methods=['DELETE'])
def delete_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    db.session.delete(destination)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/destinations/<int:dest_id>/images', methods=['POST'])
def add_image_to_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    files = request.files.getlist('images')
    if not files:
        return jsonify({'error': 'No images provided'}), 400
    for file in files:
        if file and file.filename:
            ext = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            filename = secure_filename(unique_filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            url = f'/uploads/{filename}'
            image = Image(url=url, destination_id=destination.id)
            db.session.add(image)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/images/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    image = Image.query.get_or_404(image_id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/destinations/<int:dest_id>/programmes', methods=['GET'])
def get_programmes_for_destination(dest_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    destination = Destination.query.get_or_404(dest_id)
    programmes = destination.programmes.all()
    result = []
    for p in programmes:
        dates = p.available_dates.all()
        hotels_data = []
        for h in p.hotels_in_programme:
            hotels_data.append({
                'id': h.id,
                'name': h.name,
                'description': h.description,
                'image': h.images[0].url if h.images else None
            })
        result.append({
            'id': p.id, 
            'title': p.title, 
            'description': p.description, 
            'price': p.price,
            'available_dates': [{'id': d.id, 'date': d.date.isoformat()} for d in dates],
            'hotels': hotels_data
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
    if not destination_id or not title:
        return jsonify({"error": "destination_id and title are required"}), 400
    prog = Programme(
        destination_id=destination_id, 
        title=title, 
        description=data.get('description'), 
        price=data.get('price')
    )
    db.session.add(prog)
    db.session.commit()
    return jsonify({'id': prog.id}), 201

@app.route('/api/admin/programmes', methods=['GET'])
def get_admin_programmes():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    programmes = Programme.query.all()
    result = []
    for p in programmes:
        result.append({
            'id': p.id,
            'title': p.title,
            'destination_id': p.destination_id,
            'destination_name': p.destination.name if p.destination else 'N/A'
        })
    return jsonify(result)

@app.route('/api/admin/programmes/<int:prog_id>', methods=['DELETE'])
def delete_programme(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    prog = Programme.query.get_or_404(prog_id)
    db.session.delete(prog)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/admin/programmes/<int:prog_id>', methods=['PUT'])
def update_programme(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    prog = Programme.query.get_or_404(prog_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    prog.title = data.get('title', prog.title)
    prog.description = data.get('description', prog.description)
    prog.price = data.get('price', prog.price)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/admin/programmes/<int:prog_id>/days', methods=['GET'])
def get_program_days(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    programme = Programme.query.get_or_404(prog_id)
    days = programme.program_days.order_by(ProgramDay.day_number).all()
    return jsonify([{'id': d.id, 'day_number': d.day_number, 'title': d.title, 'description': d.description} for d in days])

@app.route('/api/admin/programmes/<int:prog_id>/dates', methods=['GET'])
def get_program_dates(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    programme = Programme.query.get_or_404(prog_id)
    dates = programme.available_dates.order_by(AvailableDate.date).all()
    return jsonify([{'id': d.id, 'date': d.date.isoformat()} for d in dates])


# --- CRUD ProgramDay ---

@app.route('/api/admin/programmes/<int:prog_id>/days', methods=['POST'])
def create_program_day(prog_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    data = request.get_json()
    if not data or not data.get('day_number') or not data.get('title'):
        return jsonify({"error": "day_number and title are required"}), 400
    day = ProgramDay(
        programme_id=prog_id,
        day_number=data['day_number'],
        title=data['title'],
        description=data.get('description')
    )
    db.session.add(day)
    db.session.commit()
    return jsonify({'id': day.id}), 201

@app.route('/api/admin/program_days/<int:day_id>', methods=['PUT'])
def update_program_day(day_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    day = ProgramDay.query.get_or_404(day_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    day.day_number = data.get('day_number', day.day_number)
    day.title = data.get('title', day.title)
    day.description = data.get('description', day.description)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/program_days/<int:day_id>', methods=['DELETE'])
def delete_program_day(day_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    day = ProgramDay.query.get_or_404(day_id)
    db.session.delete(day)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/admin/destinations/<int:dest_id>/images', methods=['GET'])
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
    return jsonify([{'id': h.id, 'name': h.name, 'description': h.description, 'programme_id': h.programme_id} for h in hotels])

@app.route('/api/admin/hotels', methods=['POST'])
def create_hotel():
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    name = data.get('name')
    programme_id = data.get('programme_id')
    if not name or not programme_id:
        return jsonify({"error": "name and programme_id are required"}), 400
    hotel = Hotel(
        name=name, 
        description=data.get('description'),
        programme_id=programme_id
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

@app.route('/api/admin/hotels/<int:hotel_id>', methods=['PUT'])
def update_hotel(hotel_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    hotel = Hotel.query.get_or_404(hotel_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    hotel.name = data.get('name', hotel.name)
    hotel.description = data.get('description', hotel.description)
    hotel.programme_id = data.get('programme_id', hotel.programme_id)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/admin/hotels/<int:hotel_id>/images', methods=['GET'])
def get_images_for_hotel(hotel_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    hotel = Hotel.query.get_or_404(hotel_id)
    images = hotel.images
    return jsonify([{'id': i.id, 'url': i.url} for i in images])

@app.route('/api/admin/hotels/<int:hotel_id>/images', methods=['POST'])
def add_image_to_hotel(hotel_id):
    if not is_admin(request): return jsonify(error='Unauthorized'), 403
    hotel = Hotel.query.get_or_404(hotel_id)
    files = request.files.getlist('images')
    if not files:
        return jsonify({'error': 'No images provided'}), 400
    for file in files:
        if file and file.filename:
            ext = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            filename = secure_filename(unique_filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            url = f'/uploads/{filename}'
            image = Image(url=url, hotel_id=hotel.id)
            db.session.add(image)
    db.session.commit()
    return jsonify({'success': True})

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
    if not name or not destination_id:
        return jsonify({"error": "name and destination_id are required"}), 400
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
    images = activity.images
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