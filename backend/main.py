"""
Smart Resume Analyzer — Flask Backend
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.parser import parse_file
from services.analyzer import analyze_resume

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
def upload_resume():
    """Upload and analyze a resume file (PDF or DOCX)."""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type. Please upload a PDF or DOCX."}), 400

    file_bytes = file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Maximum size is 10MB."}), 400

    try:
        # Extract text from the uploaded file
        text = parse_file(file_bytes, file.filename)

        if not text or len(text.strip()) < 20:
            return jsonify({"error": "Could not extract meaningful text from the file."}), 422

        # Analyze the resume
        result = analyze_resume(text)
        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Resume Analyzer API is running"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
