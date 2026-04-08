from database_config import get_database_connection

def create_company(user_id, company_name, hr_contact, website):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO company (user_id, company_name, hr_contact, website)
        VALUES (?, ?, ?, ?)
    """, (user_id, company_name, hr_contact, website))

    connection.commit()
    connection.close()