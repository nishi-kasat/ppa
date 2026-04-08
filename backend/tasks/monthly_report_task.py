from celery_config import celery_app
from database_config import get_database_connection

@celery_app.task
def generate_monthly_report():
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM placement_drive")
    total_drives = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM application")
    total_applications = cursor.fetchone()["count"]

    cursor.execute("""
        SELECT COUNT(*) as count FROM application WHERE status = 'selected'
    """)
    total_selected = cursor.fetchone()["count"]

    report = f"""
    Monthly Report:
    Total Drives: {total_drives}
    Total Applications: {total_applications}
    Total Selected: {total_selected}
    """

    print(report)

    connection.close()