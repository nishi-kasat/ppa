from flask import Blueprint, request, jsonify, session
from database_config import get_database_connection

company_routes = Blueprint("company_routes", __name__)

def check_company():
    return "user_role" in session and session["user_role"] == "company"


def get_company_id(user_id):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT company_id FROM company WHERE user_id = ?", (user_id,))
    company = cursor.fetchone()

    connection.close()

    if company:
        return company["company_id"]
    return None


@company_routes.route("/dashboard", methods=["GET"])
def company_dashboard():
    if not check_company():
        return jsonify({"message": "unauthorized"}), 403

    user_id = session["user_id"]
    company_id = get_company_id(user_id)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM company WHERE company_id = ?", (company_id,))
    company_details = cursor.fetchone()

    cursor.execute("""
        SELECT drive_id, job_title,
        (SELECT COUNT(*) FROM application WHERE drive_id = placement_drive.drive_id) as applicants
        FROM placement_drive
        WHERE company_id = ?
    """, (company_id,))
    drives = cursor.fetchall()

    connection.close()

    return jsonify({
        "company": dict(company_details),
        "drives": [dict(d) for d in drives]
    })


@company_routes.route("/create_drive", methods=["POST"])
def create_drive():
    if not check_company():
        return jsonify({"message": "unauthorized"}), 403

    user_id = session["user_id"]
    company_id = get_company_id(user_id)

    data = request.get_json()

    job_title = data.get("job_title")
    job_description = data.get("job_description")
    eligibility_branch = data.get("eligibility_branch")
    eligibility_cgpa = data.get("eligibility_cgpa")
    eligibility_year = data.get("eligibility_year")
    application_deadline = data.get("application_deadline")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO placement_drive (
            company_id,
            job_title,
            job_description,
            eligibility_branch,
            eligibility_cgpa,
            eligibility_year,
            application_deadline
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        company_id,
        job_title,
        job_description,
        eligibility_branch,
        eligibility_cgpa,
        eligibility_year,
        application_deadline
    ))

    connection.commit()
    connection.close()

    return jsonify({"message": "drive created and pending admin approval"})


@company_routes.route("/applications/<int:drive_id>", methods=["GET"])
def get_applications(drive_id):
    if not check_company():
        return jsonify({"message": "unauthorized"}), 403

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT application.application_id, student.full_name, application.status
        FROM application
        JOIN student ON application.student_id = student.student_id
        WHERE application.drive_id = ?
    """, (drive_id,))

    applications = cursor.fetchall()

    connection.close()

    return jsonify([dict(a) for a in applications])


@company_routes.route("/update_status/<int:application_id>", methods=["POST"])
def update_application_status(application_id):
    if not check_company():
        return jsonify({"message": "unauthorized"}), 403

    data = request.get_json()
    status = data.get("status")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE application
        SET status = ?
        WHERE application_id = ?
    """, (status, application_id))

    connection.commit()
    connection.close()

    return jsonify({"message": "status updated"})