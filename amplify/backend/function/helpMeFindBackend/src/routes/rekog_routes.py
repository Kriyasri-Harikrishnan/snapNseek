from flask import Blueprint, request, jsonify
import requests
from services.aws_clients import rekognition_client, table, increment_metric
from utils.logger import setup_logger
from config import EBAY_ACCESS_TOKEN, EBAY_MARKETPLACE_ID, EBAY_BROWSE_API_URL

rekog_bp = Blueprint("rekog", __name__)
logger = setup_logger()

@rekog_bp.route("/rekog-search", methods=['POST', 'OPTIONS'])
def rekog_search():
    image_url = request.json.get("image_url")
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    try:
        image_response = requests.get(image_url)
        image_response.raise_for_status()
        image_bytes = image_response.content

        rekog_response = rekognition_client.detect_labels(
            Image={"Bytes": image_bytes}, MaxLabels=10, MinConfidence=80
        )
        labels = [label["Name"] for label in rekog_response["Labels"]]
        increment_metric("RekognitionCalls")

        import time
        table.put_item(
            Item={
                "imageId": str(int(time.time() * 1000)),
                "timestamp": int(time.time()),
                "imageUrl": image_url,
                "labels": labels
            }
        )

        phrase = " ".join([w for w in labels if len(w) > 3][:4])
        headers = {
            "Authorization": f"Bearer {EBAY_ACCESS_TOKEN}",
            "X-EBAY-C-MARKETPLACE-ID": EBAY_MARKETPLACE_ID,
            "Content-Type": "application/json",
        }
        params = {"q": phrase, "limit": 5}
        ebay_response = requests.get(EBAY_BROWSE_API_URL, headers=headers, params=params)

        return jsonify({
            "search_phrase": phrase,
            "items": ebay_response.json().get("itemSummaries", [])
        })

    except Exception as e:
        logger.exception("Rekognition + eBay search failed")
        return jsonify({"error": str(e)}), 500