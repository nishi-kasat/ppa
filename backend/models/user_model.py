from database_config import get_database_connection

def create_user(username, password, role):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO user (username, password, role)
        VALUES (?, ?, ?)
    """, (username, password, role))

    connection.commit()
    connection.close()

def get_user_by_username(username):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM user WHERE username = ?
    """, (username,))

    user = cursor.fetchone()
    connection.close()
    return user
