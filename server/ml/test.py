from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, InputLayer, Normalization
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# Load dan pisahkan data
df = pd.read_csv('dataset1.csv')
X = df[['Soil_Moisture', 'Temperature', 'Air_Humidity']]
y = df['Pump_Data']  # atau label lainnya

# Konversi ke numpy
X_np = X.to_numpy()
y_np = y.to_numpy()

# Buat layer normalisasi dan fit dengan data
normalizer = Normalization()
normalizer.adapt(X_np)

# Bangun model
model = Sequential([
    InputLayer(input_shape=(3,)),
    normalizer,  # <- normalisasi di dalam model
    Dense(16, activation='relu'),
    Dense(8, activation='relu'),
    Dense(1, activation='sigmoid')  # atau 'linear' jika output prediksi numerik
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])  # sesuaikan loss
model.fit(X_np, y_np, epochs=50, batch_size=16, validation_split=0.2)

# Simpan model
model.save('best_irrigation_model.keras')