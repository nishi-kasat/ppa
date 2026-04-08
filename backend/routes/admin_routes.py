from flask import Blueprint, jsonify, session, request
from database_config import get_database_connection
from redis_cache import get_cache, set_cache

admin_routes = Blueprint("admin_routes", __name__)

def check_admin():
    return "user_role" in session and session["user_role"] == "administrator"


@admin_routes.route("/dashboard", methods=["GET"])
def admin_dashboard():
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    cache_key = "admin_dashboard"

    cached_data = get_cache(cache_key)
    if cached_data:
        return jsonify(cached_data)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM student")
    total_students = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM company")
    total_companies = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM placement_drive")
    total_drives = cursor.fetchone()["count"]

    connection.close()

    result = {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_drives": total_drives
    }

    set_cache(cache_key, result, expiry=60)

    return jsonify(result)


@admin_routes.route("/companies", methods=["GET"])
def get_all_companies():
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM company")
    companies = cursor.fetchall()

    connection.close()

    return jsonify([dict(company) for company in companies])


@admin_routes.route("/approve_company/<int:company_id>", methods=["POST"])
def approve_company(company_id):
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE company
        SET approval_status = 'approved'
        WHERE company_id = ?
    """, (company_id,))

    connection.commit()
    connection.close()

    return jsonify({"message": "company approved"})


@admin_routes.route("/reject_company/<int:company_id>", methods=["POST"])
def reject_company(company_id):
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE company
        SET approval_status = 'rejected'
        WHERE company_id = ?
    """, (company_id,))

    connection.commit()
    connection.close()

    return jsonify({"message": "company rejected"})


@admin_routes.route("/blacklist_company/<int:company_id>", methods=["POST"])
def blacklist_company(company_id):
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE company
        SET is_blacklisted = 1
        WHERE company_id = ?
    """, (company_id,))

    connection.commit()
    connection.close()

    return jsonify({"message": "company blacklisted"})


@admin_routes.route("/students", methods=["GET"])
def get_all_students():
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM student")
    students = cursor.fetchall()

    connection.close()

    return jsonify([dict(student) for student in students])


@admin_routes.route("/search", methods=["GET"])
def search():
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    query = request.args.get("query")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM student WHERE full_name LIKE ?
    """, ("%" + query + "%",))
    students = cursor.fetchall()

    cursor.execute("""
        SELECT * FROM company WHERE company_name LIKE ?
    """, ("%" + query + "%",))
    companies = cursor.fetchall()

    connection.close()

    return jsonify({
        "students": [dict(s) for s in students],
        "companies": [dict(c) for c in companies]
    })


@admin_routes.route("/approve_drive/<int:drive_id>", methods=["POST"])
def approve_drive(drive_id):
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE placement_drive
        SET status = 'approved'
        WHERE drive_id = ?
    """, (drive_id,))

    connection.commit()
    connection.close()

    return jsonify({"message": "drive approved"})


@admin_routes.route("/reject_drive/<int:drive_id>", methods=["POST"])
def reject_drive(drive_id):
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE placement_drive
        SET status = 'rejected'
        WHERE drive_id = ?
    """, (drive_id,))

    connection.commit()
    connection.close()

    return jsonify({"message": "drive rejected"})


@admin_routes.route("/drives", methods=["GET"])
def get_all_drives():
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT placement_drive.*, company.company_name
        FROM placement_drive
        JOIN company ON placement_drive.company_id = company.company_id
    """)
    drives = cursor.fetchall()

    connection.close()

    return jsonify([dict(d) for d in drives])

@admin_routes.route("/deactivate_student/<int:user_id>", methods=["POST"])
def deactivate_student(user_id):
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE user SET is_active = 0 WHERE user_id = ?
    """, (user_id,))

    connection.commit()
    connection.close()

    return jsonify({"message": "student deactivated"})


@admin_routes.route("/applications", methods=["GET"])
def get_all_applications():
    if not check_admin():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT application.application_id,
               student.full_name,
               placement_drive.job_title,
               application.status,
               application.application_date
        FROM application
        JOIN student ON application.student_id = student.student_id
        JOIN placement_drive ON application.drive_id = placement_drive.drive_id
    """)
    applications = cursor.fetchall()

    connection.close()

    return jsonify([dict(a) for a in applications])