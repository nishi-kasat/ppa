from database_config import get_database_connection

def create_placement_drive(
    company_id,
    job_title,
    job_description,
    eligibility_branch,
    eligibility_cgpa,
    eligibility_year,
    application_deadline
):
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