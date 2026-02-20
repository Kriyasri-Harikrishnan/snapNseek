from flask import Blueprint, request, jsonify
import boto3
import json
import base64
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from utils.logger import setup_logger
from config import GCP_S3_BUCKET, GCP_S3_KEY

logger = setup_logger()
gcva_bp = Blueprint("gcva", __name__)
s3 = boto3.client("s3")


def get_access_token(service_account_info):
    """Generate OAuth2 access token from service account JSON"""
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    credentials.refresh(Request())
    return credentials.token


def extract_web_data(image_bytes):
    """Call Google Vision API REST endpoint for web detection"""
    try:
        resp = s3.get_object(Bucket=GCP_S3_BUCKET, Key=GCP_S3_KEY)
        service_account_info = json.loads(resp["Body"].read())

        access_token = get_access_token(service_account_info)

        endpoint = "https://vision.googleapis.com/v1/images:annotate"
        headers = {"Authorization": f"Bearer {access_token}"}

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        request_body = {
            "requests": [
                {
                    "image": {"content": image_base64},
                    "features": [{"type": "WEB_DETECTION"}],
                }
            ]
        }

        response = requests.post(endpoint, headers=headers, json=request_body)
        response.raise_for_status()
        result = response.json()

        web = result.get("responses", [{}])[0].get("webDetection", {})

        return {
            "web_entities": [
                {"id": e.get("entityId"), "desc": e.get("description"), "score": e.get("score")}
                for e in web.get("webEntities", [])
            ],
            "full_matching_images": [img.get("url") for img in web.get("fullMatchingImages", [])],
            "partial_matching_images": [img.get("url") for img in web.get("partialMatchingImages", [])],
            "visually_similar_images": [img.get("url") for img in web.get("visuallySimilarImages", [])],
            "pages_with_matching_images": [
                {
                    "url": p.get("url"),
                    "page_title": p.get("pageTitle"),
                    "full_matching_images": [img.get("url") for img in p.get("fullMatchingImages", [])],
                    "partial_matching_images": [img.get("url") for img in p.get("partialMatchingImages", [])],
                }
                for p in web.get("pagesWithMatchingImages", [])
            ],
            "best_guess_labels": [label.get("label") for label in web.get("bestGuessLabels", [])],
        }

    except Exception as e:
        logger.exception("Error calling Google Vision API (REST)")
        raise e


@gcva_bp.route("/gcva/search-by-image", methods=["POST"])
def gcva_search_by_image():
    data = request.get_json()
    image_url = data.get("image_url")
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    try:
        img_resp = requests.get(image_url)
        img_resp.raise_for_status()
        image_bytes = img_resp.content

        web_data = extract_web_data(image_bytes)
        return jsonify(web_data)

    except Exception as e:
        logger.exception("Error in GCVA search")
        return jsonify({"error": str(e)}), 500
