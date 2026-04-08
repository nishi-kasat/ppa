import sqlite3
from werkzeug.security import generate_password_hash

database_name = "placement_portal_database.db"

def get_database_connection():
    connection = sqlite3.connect(database_name)
    connection.row_factory = sqlite3.Row
    return connection

def create_tables():
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            is_active INTEGER DEFAULT 1
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student (
            student_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            full_name TEXT,
            branch TEXT,
            cgpa REAL,
            graduation_year INTEGER,
            resume_path TEXT,
            FOREIGN KEY(user_id) REFERENCES user(user_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS company (
            company_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            company_name TEXT,
            hr_contact TEXT,
            website TEXT,
            approval_status TEXT DEFAULT 'pending',
            is_blacklisted INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES user(user_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS placement_drive (
            drive_id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER,
            job_title TEXT,
            job_description TEXT,
            eligibility_branch TEXT,
            eligibility_cgpa REAL,
            eligibility_year INTEGER,
            application_deadline TEXT,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY(company_id) REFERENCES company(company_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS application (
            application_id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            drive_id INTEGER,
            application_date TEXT,
            status TEXT DEFAULT 'applied',
            FOREIGN KEY(student_id) REFERENCES student(student_id),
            FOREIGN KEY(drive_id) REFERENCES placement_drive(drive_id),
            UNIQUE(student_id, drive_id)
        )
    """)

    connection.commit()
    connection.close()

def create_administrator():
    connection = get_database_connection()
    cursor = connection.cursor()

    username = "Administrator"
    password = "Nishi_PPA"
    role = "administrator"

    cursor.execute("SELECT * FROM user WHERE username = ?", (username,))
    existing_admin = cursor.fetchone()

    if existing_admin is None:
        hashed_password = generate_password_hash(password)
        cursor.execute("""
            INSERT INTO user (username, password, role)
            VALUES (?, ?, ?)
        """, (username, hashed_password, role))
        connection.commit()

    connection.close()
