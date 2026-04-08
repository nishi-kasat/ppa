from flask import Blueprint, jsonify, session, request
from database_config import get_database_connection
from datetime import datetime
from redis_cache import get_cache, set_cache
from tasks.export_csv_task import export_applications_csv

student_routes = Blueprint("student_routes", __name__)

def check_student():
    return "user_role" in session and session["user_role"] == "student"


def get_student_id(user_id):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT student_id FROM student WHERE user_id = ?", (user_id,))
    student = cursor.fetchone()

    connection.close()

    if student:
        return student["student_id"]
    return None


@student_routes.route("/dashboard", methods=["GET"])
def student_dashboard():
    if not check_student():
        return jsonify({"message": "unauthorized"}), 403

    user_id = session["user_id"]

    cache_key = f"student_dashboard_{user_id}"

    cached_data = get_cache(cache_key)
    if cached_data:
        return jsonify(cached_data)

    student_id = get_student_id(user_id)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM placement_drive
        WHERE status = 'approved'
    """)
    drives = cursor.fetchall()

    cursor.execute("""
        SELECT drive_id, status
        FROM application
        WHERE student_id = ?
    """, (student_id,))
    applications = cursor.fetchall()

    connection.close()

    result = {
        "drives": [dict(d) for d in drives],
        "applications": [dict(a) for a in applications]
    }

    set_cache(cache_key, result, expiry=60)

    return jsonify(result)


@student_routes.route("/apply/<int:drive_id>", methods=["POST"])
def apply_drive(drive_id):
    if not check_student():
        return jsonify({"message": "unauthorized"}), 403

    user_id = session["user_id"]
    student_id = get_student_id(user_id)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM application
        WHERE student_id = ? AND drive_id = ?
    """, (student_id, drive_id))

    existing = cursor.fetchone()

    if existing:
        connection.close()
        return jsonify({"message": "already applied"}), 400

    cursor.execute("""
        SELECT eligibility_branch, eligibility_cgpa, eligibility_year
        FROM placement_drive
        WHERE drive_id = ? AND status = 'approved'
    """, (drive_id,))
    drive = cursor.fetchone()

    if not drive:
        connection.close()
        return jsonify({"message": "drive not available"}), 404

    cursor.execute("""
        SELECT branch, cgpa, graduation_year
        FROM student
        WHERE student_id = ?
    """, (student_id,))
    student = cursor.fetchone()

    if student["branch"] != drive["eligibility_branch"]:
        connection.close()
        return jsonify({"message": "branch not eligible"}), 403

    if student["cgpa"] < drive["eligibility_cgpa"]:
        connection.close()
        return jsonify({"message": "cgpa not eligible"}), 403

    if student["graduation_year"] != drive["eligibility_year"]:
        connection.close()
        return jsonify({"message": "year not eligible"}), 403

    application_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO application (student_id, drive_id, application_date)
        VALUES (?, ?, ?)
    """, (student_id, drive_id, application_date))

    connection.commit()
    connection.close()

    return jsonify({"message": "application submitted"})


@student_routes.route("/search_drives", methods=["GET"])
def search_drives():
    if not check_student():
        return jsonify({"message": "unauthorized"}), 403

    query = request.args.get("query")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM placement_drive
        WHERE status = 'approved' AND job_title LIKE ?
    """, ("%" + query + "%",))

    drives = cursor.fetchall()
    connection.close()

    return jsonify([dict(d) for d in drives])


@student_routes.route("/applications", methods=["GET"])
def get_applications():
    if not check_student():
        return jsonify({"message": "unauthorized"}), 403

    user_id = session["user_id"]
    student_id = get_student_id(user_id)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT placement_drive.job_title, application.status, application.application_date
        FROM application
        JOIN placement_drive ON application.drive_id = placement_drive.drive_id
        WHERE application.student_id = ?
    """, (student_id,))

    applications = cursor.fetchall()

    connection.close()

    return jsonify([dict(a) for a in applications])

@student_routes.route("/upload_resume", methods=["POST"])
def upload_resume():
    if not check_student():
        return jsonify({"message": "unauthorized"}), 403

    file = request.files.get("resume")

    if not file:
        return jsonify({"message": "no file"}), 400

    file_path = f"resumes/{file.filename}"
    file.save(file_path)

    user_id = session["user_id"]
    student_id = get_student_id(user_id)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE student SET resume_path = ?
        WHERE student_id = ?
    """, (file_path, student_id))

    connection.commit()
    connection.close()

    return jsonify({"message": "resume uploaded"})


@student_routes.route("/export_csv", methods=["GET"])
def export_csv():
    if not check_student():
        return jsonify({"message": "unauthorized"}), 403

    user_id = session["user_id"]
    student_id = get_student_id(user_id)

    task = export_applications_csv.delay(student_id)

    return jsonify({
        "message": "csv export started",
        "task_id": task.id
    })