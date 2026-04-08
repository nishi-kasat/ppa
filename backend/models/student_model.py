from database_config import get_database_connection

def create_student(user_id, full_name, branch, cgpa, graduation_year):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO student (user_id, full_name, branch, cgpa, graduation_year)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, full_name, branch, cgpa, graduation_year))

    connection.commit()
    connection.close()
