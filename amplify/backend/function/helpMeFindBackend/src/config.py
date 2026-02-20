import os

EBAY_BROWSE_API_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search"
EBAY_ACCESS_TOKEN = os.environ.get("EBAY_ACCESS_TOKEN")
EBAY_MARKETPLACE_ID = os.environ.get("EBAY_MARKETPLACE_ID")
EBAY_ACCESS_TOKEN = os.environ.get("EBAY_ACCESS_TOKEN")
S3_BUCKET = os.environ.get("S3_BUCKET")
AWS_REGION = os.environ.get("AWS_REGION")

GCP_S3_BUCKET = os.environ.get("GCVA_S3_BUCKET")  
GCP_S3_KEY = os.environ.get("GCVA_S3_KEY")       