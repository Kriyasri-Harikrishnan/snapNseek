from flask import Blueprint, jsonify
import boto3
from datetime import datetime, timedelta

metrics_bp = Blueprint("metrics", __name__)
cloudwatch = boto3.client("cloudwatch", region_name="ap-south-1")

def get_metric_sum(metric_name):
    response = cloudwatch.get_metric_statistics(
        Namespace="HelpMeFind",       
        MetricName=metric_name,
        StartTime=datetime.now() - timedelta(days=7),
        EndTime=datetime.now(),
        Period=86400,                 
        Statistics=["Sum"]
    )
    datapoints = response.get("Datapoints", [])
    if datapoints:
        latest = sorted(datapoints, key=lambda x: x['Timestamp'], reverse=True)[0]
        return int(latest["Sum"])
    return 0

@metrics_bp.route("/metrics", methods=["GET"])
def metrics():
    try:
        data = {
            "s3Uploads": get_metric_sum("S3Uploads"),
            "rekognitionCalls": get_metric_sum("RekognitionCalls"),
            "ebayCalls": get_metric_sum("EbayAPICalls")
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
