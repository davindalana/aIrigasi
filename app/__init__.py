import os
from flask import Flask
from dotenv import load_dotenv
from app.extensions import mongo
from app.api import register_api
from config import Config

def create_app():
    load_dotenv()  # Load from .env
    app = Flask(__name__)
    app.config.from_object(Config)
    print("✅ Mongo URI:", app.config.get("MONGO_URI"))  # Debug check


    mongo.init_app(app)
    register_api(app)

    @app.route("/")
    def home():
        return "<h1>Sensor API is running!</h1>"

    return app
