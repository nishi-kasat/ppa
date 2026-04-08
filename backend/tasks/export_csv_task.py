from celery_config import celery_app
from database_config import get_database_connection
import csv

@celery_app.task
def export_applications_csv(student_id):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT student.student_id,
               company.company_name,
               placement_drive.job_title,
               application.status,
               application.application_date
        FROM application
        JOIN placement_drive ON application.drive_id = placement_drive.drive_id
        JOIN company ON placement_drive.company_id = company.company_id
        JOIN student ON application.student_id = student.student_id
        WHERE student.student_id = ?
    """, (student_id,))

    data = cursor.fetchall()

    file_name = f"student_{student_id}_applications.csv"

    with open(file_name, "w", newline="") as file:
        writer = csv.writer(file)

        writer.writerow([
            "student_id",
            "company_name",
            "job_title",
            "status",
            "application_date"
        ])

        for row in data:
            writer.writerow([
                row["student_id"],
                row["company_name"],
                row["job_title"],
                row["status"],
                row["application_date"]
            ])

    connection.close()

    return file_name