def lambda_handler(event, context):
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "https://dev.d1b1bwx2r3r3k0.amplifyapp.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body": "OK"
    }
    return response