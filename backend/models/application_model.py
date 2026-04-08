from database_config import get_database_connection
from datetime import datetime

def create_application(student_id, drive_id):
    connection = get_database_connection()
    cursor = connection.cursor()

    application_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO application (student_id, drive_id, application_date)
        VALUES (?, ?, ?)
    """, (student_id, drive_id, application_date))

    connection.commit()
    connection.close()