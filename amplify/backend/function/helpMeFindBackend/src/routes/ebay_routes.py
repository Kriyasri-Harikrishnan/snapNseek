from flask import Blueprint, request, jsonify
import base64, requests
from utils.logger import setup_logger
from config import EBAY_ACCESS_TOKEN, EBAY_MARKETPLACE_ID, EBAY_BROWSE_API_URL
from services.aws_clients import increment_metric

ebay_bp = Blueprint("ebay", __name__)
logger = setup_logger()

@ebay_bp.route("/ebay/search-by-image", methods=['POST', 'OPTIONS'])
def search_by_image():
    data = request.get_json()
    image_url = data.get("image_url")
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    try:
        image_response = requests.get(image_url)
        image_response.raise_for_status()
        image_b64 = base64.b64encode(image_response.content).decode("utf-8")

        headers = {
            "Authorization": f"Bearer {EBAY_ACCESS_TOKEN}",
            "X-EBAY-C-MARKETPLACE-ID": EBAY_MARKETPLACE_ID,
            "Content-Type": "application/json",
        }
        ebay_url = f"{EBAY_BROWSE_API_URL}_by_image?limit=5"
        payload = {"image": image_b64}

        response = requests.post(ebay_url, headers=headers, json=payload)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch from eBay", "details": response.text}), response.status_code
        
        increment_metric("EbayAPICalls")
        return jsonify(response.json())
    
    except Exception as e:
        logger.exception("Error in search-by-image")
        return jsonify({"error": str(e)}), 500
