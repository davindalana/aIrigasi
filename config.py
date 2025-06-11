import os

class Config:
    MONGO_URI = os.getenv("MONGO_URI")  # loaded from .env
