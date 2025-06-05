from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
import pandas as pd

app = Flask(__name__)

# Load model dan scaler
model = tf.keras.models.load_model('best_irrigation_model.keras')
scaler = joblib.load('scaler.pkl')

# Nama fitur harus sama dengan saat scaler dilatih
FEATURE_NAMES = ['Soil_Moisture', 'Temperature', 'Air_Humidity']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Validasi input
        if not all(k in data for k in FEATURE_NAMES):
            return jsonify({'error': 'Incomplete or invalid data. Required keys: Soil_Moisture, Temperature, Air_Humidity'}), 400

        # Masukkan ke DataFrame agar sesuai dengan scaler
        df_input = pd.DataFrame([[
            data['Soil_Moisture'],
            data['Temperature'],
            data['Air_Humidity']
        ]], columns=FEATURE_NAMES)

        # Skalakan input
        scaled_input = scaler.transform(df_input)

        # Prediksi
        prediction = model.predict(scaled_input, verbose=0)
        result = float(prediction[0][0])

        return jsonify({
    'result': round(result, 4),  # Hasil dibulatkan 4 digit
    'needs_watering': result >= 0.5
})


    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8001)
