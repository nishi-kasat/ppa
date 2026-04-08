from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from database_config import get_database_connection

auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM user WHERE username = ?", (username,))
    user = cursor.fetchone()

    connection.close()

    if user is None:
        return jsonify({"message": "invalid username"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"message": "invalid password"}), 401

    if user["is_active"] == 0:
        return jsonify({"message": "user deactivated"}), 403

    session["user_id"] = user["user_id"]
    session["user_role"] = user["role"]

    return jsonify({
        "message": "login successful",
        "role": user["role"]
    })


@auth_routes.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "logged out"})


@auth_routes.route("/check_session", methods=["GET"])
def check_session():
    if "user_id" not in session:
        return jsonify({"logged_in": False})

    return jsonify({
        "logged_in": True,
        "role": session.get("user_role")
    })