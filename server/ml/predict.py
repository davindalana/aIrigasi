from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model('best_irrigation_model.keras')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    soil = data.get('Soil_Moisture')
    temp = data.get('Temperature')
    hum = data.get('Air_Humidity')

    if None in [soil, temp, hum]:
        return jsonify({'error': 'Incomplete data'}), 400

    input_data = np.array([[soil, temp, hum]])
    prediction = model.predict(input_data)
    result = float(prediction[0][0])

    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(port=8001)