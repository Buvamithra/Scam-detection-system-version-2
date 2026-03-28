import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Generate synthetic dataset
np.random.seed(42)

data = pd.DataFrame({
    "amount": np.random.randint(100, 20000, 1000),
    "is_new_upi": np.random.randint(0, 2, 1000),
    "is_blacklisted": np.random.randint(0, 2, 1000),
    "night_transaction": np.random.randint(0, 2, 1000),
    "location_risk": np.random.randint(0, 100, 1000)
})

# Fraud rule simulation
data["fraud"] = (
    (data["amount"] > 10000) |
    (data["is_blacklisted"] == 1) |
    ((data["night_transaction"] == 1) & (data["location_risk"] > 70))
).astype(int)

X = data.drop("fraud", axis=1)
y = data["fraud"]

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "fraud_model.pkl")

print("Model trained and saved successfully.")
