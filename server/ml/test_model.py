import numpy as np
import tensorflow as tf
import pandas as pd
import joblib

# Load model dan scaler
model = tf.keras.models.load_model('best_irrigation_model.keras')
scaler = joblib.load('scaler.pkl')

# Daftar input sensor
test_data = [
    [805, 30, 100],
    [425, 30, 100],
    [50, 30, 60],
    [895, 28.2, 60.1],
    [20, 25, 80],
    [90, 35, 40],
]

# Prediksi
for i, data in enumerate(test_data, 1):
    df_input = pd.DataFrame([data], columns=['Soil_Moisture', 'Temperature', 'Air_Humidity'])
    scaled = scaler.transform(df_input)
    prediction = model.predict(scaled, verbose=0)
    result = prediction[0][0]
    status = 'Butuh Penyiraman' if result > 0.5 else 'Tidak Perlu'
    print(f"Data ke-{i}: {data} → Prediksi: {result:.6f} → {status}")
