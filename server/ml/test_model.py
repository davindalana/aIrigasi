import numpy as np
import tensorflow as tf

# Load model
model = tf.keras.models.load_model('best_irrigation_model.keras')

# Daftar input sensor (Soil_Moisture, Temperature, Air_Humidity)
test_data = [
    [805, 30, 100],
    [425, 30, 100],
    [50, 30, 60],
    [895, 28.2, 60.1],
    [20, 25, 80],
    [90, 35, 40],
]

# Lakukan prediksi untuk setiap data
for i, data in enumerate(test_data, 1):
    input_array = np.array([data], dtype=np.float32)
    prediction = model.predict(input_array, verbose=0)
    result = prediction[0][0]
    print(f"Data ke-{i}: {data} → Prediksi: {result:.6f} → {'Butuh Penyiraman' if result > 0.5 else 'Tidak Perlu'}")