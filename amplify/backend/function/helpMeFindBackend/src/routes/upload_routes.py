from flask import Blueprint, request, jsonify
from botocore.exceptions import NoCredentialsError, ClientError
from services.aws_clients import s3_client, sns_client, SNS_TOPIC_ARN, increment_metric
from utils.logger import setup_logger
from config import S3_BUCKET
import uuid

upload_bp = Blueprint("upload", __name__)
logger = setup_logger()

@upload_bp.route("/upload", methods=['POST', 'OPTIONS'])
def upload_image():
    file = request.files.get("file")
    if not file:
        logger.warning("No file provided.")
        return jsonify({"error": "No file uploaded"}), 400

    filename = f"{uuid.uuid4()}_{file.filename}"

    try:
        s3_client.upload_fileobj(file, S3_BUCKET, filename, ExtraArgs={'ContentType': file.content_type})
        file_url = f"https://{S3_BUCKET}.s3.ap-south-1.amazonaws.com/{filename}"
        logger.info(f"Uploaded file: {filename}")
        increment_metric("S3Uploads")

        try:
            message = f"New image uploaded: {file_url}"
            sns_client.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=message,
                Subject="New Image Uploaded"
            )
        except Exception as sns_err:
            logger.warning(f"SNS notification failed: {sns_err}")

        return jsonify({"message": "Upload successful", "url": file_url})

    except (NoCredentialsError, ClientError) as e:
        logger.error(f"Upload failed: {e}")
        return jsonify({"error": "Upload failed", "details": str(e)}), 500