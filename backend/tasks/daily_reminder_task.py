from celery_config import celery_app
from database_config import get_database_connection
from datetime import datetime

@celery_app.task
def send_daily_reminders():
    connection = get_database_connection()
    cursor = connection.cursor()

    today = datetime.now().strftime("%Y-%m-%d")

    cursor.execute("""
        SELECT student.full_name, placement_drive.job_title, placement_drive.application_deadline
        FROM placement_drive
        JOIN application ON placement_drive.drive_id = application.drive_id
        JOIN student ON application.student_id = student.student_id
        WHERE date(placement_drive.application_deadline) = date(?)
    """, (today,))

    reminders = cursor.fetchall()

    for r in reminders:
        print(f"Reminder: {r['full_name']} apply for {r['job_title']} today")

    connection.close()