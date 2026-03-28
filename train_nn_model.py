import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Generate synthetic dataset
np.random.seed(42)

data = pd.DataFrame({
    "amount": np.random.randint(100, 20000, 5000),
    "is_new_upi": np.random.randint(0, 2, 5000),
    "is_blacklisted": np.random.randint(0, 2, 5000),
    "night_transaction": np.random.randint(0, 2, 5000),
    "location_risk": np.random.randint(0, 100, 5000)
})

# Fraud logic
data["fraud"] = (
    (data["amount"] > 10000) |
    (data["is_blacklisted"] == 1) |
    ((data["night_transaction"] == 1) & (data["location_risk"] > 70))
).astype(int)

X = data.drop("fraud", axis=1)
y = data["fraud"]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Save scaler
import joblib
joblib.dump(scaler, "scaler.pkl")

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Build Neural Network
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(5,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train, y_train, epochs=20, batch_size=32, validation_data=(X_test, y_test))

model.save("fraud_nn_model.h5")

print("Neural Network model trained & saved successfully.")
