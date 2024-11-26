from flask import Flask, send_file, abort, request, make_response, jsonify
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from io import BytesIO
import os
import json
import time
from datetime import timedelta
import hashlib
import logging

# Configure logging to display errors to stderr
logging.basicConfig(level=logging.DEBUG)

# @zhenyanovikov: в душі не їбу шо це, але воно повертається в family tree і походу якось юзається
google_api_key = os.getenv('GOOGLE_API_KEY')
spreadsheet_id = os.getenv('SPREADSHEET_ID')

# Get the API key from the environment
api_key = spreadsheet_id

# Initialize the Flask app
app = Flask(__name__)

# Cache dictionary to store image content and metadata
cache = {}

# Cache duration: 30 days in seconds
CACHE_DURATION = timedelta(days=30).total_seconds()


def is_cache_valid(timestamp):
    """Check if the cached file is still valid based on the timestamp."""
    return (time.time() - timestamp) < CACHE_DURATION


def generate_etag(content):
    """Generate an ETag based on the file content."""
    return hashlib.md5(content).hexdigest()


# Define validators based on your Lambda logic
validators = {
    "q1": lambda v: v and v.lower().strip() in ["local general assembly", "lga", "лга"],
    "q2": lambda v: v and v.lower().strip() in ["7", "сім", "seven"],
    "q3": lambda v: v and "who we are" in v.lower().strip(),
    "q4": lambda v: v and v.lower().strip() in ["bullshit", "булшит", "буллшит"],
    "q5": lambda v: v and v.lower().strip() in ["кливів", "klyviv"]
}

# Load service account credentials from the environment variable
credentials_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
if not credentials_json:
    logging.error("Missing service account credentials JSON")
    exit(1)

    # Parse the credentials JSON string
service_account_info = json.loads(credentials_json)

creds = None

try:
    creds = Credentials.from_service_account_info(service_account_info,
                                                  scopes=['https://www.googleapis.com/auth/drive.file',
                                                          'https://www.googleapis.com/auth/drive',
                                                          'https://www.googleapis.com/auth/drive.file',
                                                          'https://www.googleapis.com/auth/drive.metadata'
                                                          ])

except json.JSONDecodeError as e:
    logging.error("Error parsing service account credentials JSON: " + str(e))
    exit(1)


# New endpoint to validate responses
@app.route('/validate', methods=['GET'])
def validate_responses():
    if not request.args:
        return jsonify({"error": "No responses provided!"}), 400

    responses = request.args
    valid_responses_count = 0
    errors = {}

    # Loop over the validators to check each response
    for key, validator in validators.items():
        if key in responses and validator(responses[key]):
            valid_responses_count += 1
        elif key in responses:
            errors[key] = f"WRONG VALUE: {responses[key]}"

    if valid_responses_count >= 2:
        return jsonify({
            "apiKey": google_api_key,
            "spreadsheetId": spreadsheet_id
        }), 200
    else:
        return jsonify({
            "error": "At least 2 correct answers are required."
        }), 400


# Original endpoint to handle drive files
@app.route('/gdp/<drive_id>')
def get_file(drive_id):
    # Get the 'api_key' parameter from the URL
    param_api_key = request.args.get('api_key')
    if not param_api_key:
        return abort(400, description="Missing 'api_key' parameter")

    # Validate the 'api_key' against the environment's secret key
    if param_api_key != api_key:
        return abort(403, description="Forbidden: Invalid 'api_key' parameter")

    # Check if the file is already cached
    if drive_id in cache:
        cached_entry = cache[drive_id]
        if is_cache_valid(cached_entry['timestamp']):
            print("Serving from cache")

            # Prepare response with caching headers
            response = make_response(
                send_file(BytesIO(cached_entry['data']), download_name=cached_entry['name'],
                          mimetype=cached_entry['mimeType'])
            )
            # Add cache-control, ETag, and last-modified headers
            response.headers['Cache-Control'] = f'public, max-age={int(CACHE_DURATION)}'
            response.headers['ETag'] = cached_entry['etag']
            response.headers['Last-Modified'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT',
                                                              time.gmtime(cached_entry['timestamp']))
            return response
        else:
            # Cache expired, remove the entry
            print("Cache expired, removing entry")
            del cache[drive_id]

    try:
        google_drive = build('drive', 'v3', credentials=creds)

        # Retrieve the file metadata
        file = google_drive.files().get(fileId=drive_id, fields='name, mimeType', supportsAllDrives=True).execute()

        # Retrieve the file content
        file_data = google_drive.files().get_media(fileId=drive_id, supportsAllDrives=True).execute()

        # Generate ETag for the file content
        etag = generate_etag(file_data)

        # Cache the file content
        cache[drive_id] = {
            'data': file_data,
            'name': file['name'],
            'mimeType': file['mimeType'],
            'etag': etag,
            'timestamp': time.time()
        }
        logging.info(f"File '{file['name']}' cached")

        # Prepare the file as a downloadable attachment
        file_io = BytesIO(file_data)

        # Create the response with caching headers
        response = make_response(send_file(file_io, download_name=file['name'], mimetype=file['mimeType']))
        response.headers['Cache-Control'] = f'public, max-age={int(CACHE_DURATION)}'
        response.headers['ETag'] = etag
        response.headers['Last-Modified'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT',
                                                          time.gmtime(cache[drive_id]['timestamp']))
        return response

    except HttpError as error:
        logging.error(f'An error occurred: {error}')
        return abort(404, description="File not found")
    except Exception as e:
        logging.error(f'An error occurred: {e}')
        return abort(500, description="An internal error occurred")


@app.route('/healthcheck', methods=['GET'])
def healthcheck():
    return jsonify(status='ok'), 200


# Start the Flask application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
