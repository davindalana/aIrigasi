from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import joblib

app = FastAPI()

# Load model dan scaler
try:
    model = tf.keras.models.load_model("./ml/best_irrigation_model.keras")
    scaler = joblib.load("./ml/scaler.pkl")
except Exception as e:
    raise RuntimeError(f"Failed to load model or scaler: {e}")

class PredictRequest(BaseModel):
    features: list

@app.post("/predict")
def predict(request: PredictRequest):
    try:
        features = np.array(request.features).reshape(1, -1)
        scaled = scaler.transform(features)
        prediction = model.predict(scaled)
        result = bool(np.round(prediction[0][0]))  # Misalnya output biner (0 atau 1)

        return {"perlu_siram": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")