from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model('./best_irrigation_model.keras')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_data = np.array([[data['Soil_Moisture'], data['Temperature'], data['Air_Humidity']]])
    prediction = model.predict(input_data)
    result = 'Irigasi Diperlukan' if prediction[0][0] > 0.5 else 'Tidak Perlu Irigasi'
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(port=8001)
