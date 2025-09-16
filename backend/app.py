import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

app = Flask(__name__)

# Allow requests from the React frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- Google Sheets Configuration ---
# Define the scope for the APIs
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
]

# Path to your credentials file
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')

# Name of the Google Sheet you shared with the service account
SHEET_NAME = "AREZONA VOYAGE BOOKINGS" # e.g., "Arezona Voyage Bookings"

def get_sheets_client():
    """Initializes and returns the gspread client."""
    if not os.path.exists(CREDENTIALS_FILE):
        raise FileNotFoundError(f"Credentials file not found at {CREDENTIALS_FILE}. Please follow the setup instructions.")
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    client = gspread.authorize(creds)
    return client

@app.route('/')
def home():
    return "Hello, World! This is the backend for Arezona Voyage."

@app.route('/api/book', methods=['POST'])
def book_trip():
    """Receives booking data and appends it to a Google Sheet."""
    data = request.get_json()

    if not data or not SHEET_NAME:
        return jsonify({"error": "Missing data or sheet name not configured in the backend."}), 400

    try:
        client = get_sheets_client()
        sheet = client.open(SHEET_NAME).sheet1

        program_title = data.get('programTitle')
        selected_date = data.get('selectedDate')
        specific_request = data.get('specificRequest', '') # Get the specific request
        rows_to_add = []
        
        for traveler in data.get('travelers', []):
            row = [
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"), # Timestamp
                program_title,
                selected_date,
                traveler.get('nom'),
                traveler.get('prenom'),
                traveler.get('email'), # New field
                traveler.get('telephone'),
                traveler.get('ville'),
                specific_request # Add specific request to each traveler's row for context
            ]
            rows_to_add.append(row)

        # Add a header row if the sheet is empty
        if not sheet.get_all_values():
            sheet.append_row(['Timestamp', 'Programme', 'Date de départ', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Ville', 'Demande Spécifique'])

        sheet.append_rows(rows_to_add)

        return jsonify({"success": True, "message": "Booking successful!"}), 200

    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred while processing the booking."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
