import boto3
from config import AWS_REGION

rekognition_client = boto3.client("rekognition", region_name=AWS_REGION)

s3_client = boto3.client("s3", region_name=AWS_REGION)

dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table("ImageLabels") 

sns_client = boto3.client("sns", region_name="ap-south-1")
SNS_TOPIC_ARN = "arn:aws:sns:ap-south-1:617618117686:ImageUploadsToMyBucket"

cloudwatch = boto3.client('cloudwatch', region_name='ap-south-1')

def increment_metric(name):
    cloudwatch.put_metric_data(
        Namespace='HelpMeFind',
        MetricData=[{
            'MetricName': name,
            'Value': 1,
            'Unit': 'Count'
        }]
    )