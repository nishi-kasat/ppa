from flask import Flask
from flask_session import Session
import redis

from database_config import create_tables, create_administrator
from routes.auth_routes import auth_routes
from routes.user_routes import user_routes
from routes.admin_routes import admin_routes
from routes.company_routes import company_routes
from routes.student_routes import student_routes
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True)

# Secret key for sessions
app.secret_key = "placement_portal_secret_key"

# ✅ Redis Session Configuration
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_REDIS"] = redis.Redis(host="localhost", port=6379)

# Initialize session
Session(app)

# Database setup
create_tables()
create_administrator()

# Register routes
app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(user_routes, url_prefix="/user")
app.register_blueprint(admin_routes, url_prefix="/admin")
app.register_blueprint(company_routes, url_prefix="/company")
app.register_blueprint(student_routes, url_prefix="/student")

# Run app
if __name__ == "__main__":
    app.run(debug=True)