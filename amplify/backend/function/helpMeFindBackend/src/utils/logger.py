import logging
import watchtower
import boto3

def setup_logger():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)

    try:
        session = boto3.Session(region_name="ap-south-1")
        logs_client = session.client("logs")

        cw_handler = watchtower.CloudWatchLogHandler(
            log_group_name="SnapNSeekLogs",
            stream_name="backend",
            boto3_client=logs_client,
        )
        logger.addHandler(cw_handler)
        logger.info("CloudWatch logging initialized successfully.")

    except Exception as e:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        logger.warning(f"CloudWatch logging failed. Using console instead. Reason: {e}")

    return logger
