from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from database_config import get_database_connection

user_routes = Blueprint("user_routes", __name__)

@user_routes.route("/register_student", methods=["POST"])
def register_student():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    full_name = data.get("full_name")
    branch = data.get("branch")
    cgpa = data.get("cgpa")
    graduation_year = data.get("graduation_year")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM user WHERE username = ?", (username,))
    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()
        return jsonify({"message": "username already exists"}), 400

    hashed_password = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO user (username, password, role)
        VALUES (?, ?, ?)
    """, (username, hashed_password, "student"))

    user_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO student (user_id, full_name, branch, cgpa, graduation_year)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, full_name, branch, cgpa, graduation_year))

    connection.commit()
    connection.close()

    return jsonify({"message": "student registered successfully"})


@user_routes.route("/register_company", methods=["POST"])
def register_company():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    company_name = data.get("company_name")
    hr_contact = data.get("hr_contact")
    website = data.get("website")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM user WHERE username = ?", (username,))
    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()
        return jsonify({"message": "username already exists"}), 400

    hashed_password = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO user (username, password, role)
        VALUES (?, ?, ?)
    """, (username, hashed_password, "company"))

    user_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO company (user_id, company_name, hr_contact, website)
        VALUES (?, ?, ?, ?)
    """, (user_id, company_name, hr_contact, website))

    connection.commit()
    connection.close()

    return jsonify({"message": "company registered, waiting for admin approval"})