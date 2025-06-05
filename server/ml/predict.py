from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model('best_irrigation_model.keras')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        soil = data.get('Soil_Moisture')
        temp = data.get('Temperature')
        hum = data.get('Air_Humidity')

        if None in [soil, temp, hum]:
            return jsonify({'error': 'Incomplete data'}), 400

        # Buat array input
        input_data = np.array([[soil, temp, hum]])

        # Prediksi
        prediction = model.predict(input_data)
        result = float(prediction[0][0])

        # Kamu bisa return angka mentah atau dalam bentuk status boolean
        return jsonify({
            'result': result,
            'needs_watering': result >= 0.5  # ✅ threshold 0.5
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=8001)
