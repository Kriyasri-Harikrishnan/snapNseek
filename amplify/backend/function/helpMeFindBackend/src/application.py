from flask import Flask
from flask_cors import CORS
from routes.upload_routes import upload_bp
from routes.ebay_routes import ebay_bp
from routes.rekog_routes import rekog_bp
from routes.metrics_routes import metrics_bp
from routes.gcva_routes import gcva_bp 
from utils.logger import setup_logger
from dotenv import load_dotenv
import os

load_dotenv()

EBAY_ACCESS_TOKEN = os.getenv("EBAY_ACCESS_TOKEN")
EBAY_MARKETPLACE_ID = os.getenv("EBAY_MARKETPLACE_ID")
S3_BUCKET = os.getenv("S3_BUCKET")
AWS_REGION = os.getenv("AWS_REGION")

application = Flask(__name__)  
app = application

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

logger = setup_logger()

app.register_blueprint(upload_bp)
app.register_blueprint(ebay_bp)
app.register_blueprint(rekog_bp)
app.register_blueprint(metrics_bp)
app.register_blueprint(gcva_bp)

@app.route("/health")
def health():
    return "OK", 200


# if __name__ == "__main__":
#   logger.info("Starting Flask backend")
#   app.run(host="0.0.0.0", port=5000, debug=True)