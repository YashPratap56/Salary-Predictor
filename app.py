# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow React to talk to this Python server

# Load the saved "Brain"
data = joblib.load("salary_model_data.pkl")
model = data["model"]
scaler = data["scaler"]
encoders = data["encoders"]

@app.route('/options', methods=['GET'])
def get_options():
    """Send the list of valid jobs and options to the frontend dropdowns"""
    options = {
        "job_titles": data["top_jobs"],
        "experience_levels": list(encoders["experience_level"].classes_),
        "employment_types": list(encoders["employment_type"].classes_),
        "company_sizes": list(encoders["company_size"].classes_)
    }
    return jsonify(options)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        req = request.json
        
        # Prepare input data (Order matters! Must match training order)
        # categorical_cols order: experience_level, employment_type, job_title, employee_residence, company_location, company_size
        # We will simplify and assume user inputs "US" for location/residence for this demo to avoid massive dropdowns
        
        # 1. Encode the inputs using the saved encoders
        features = [
            encoders["experience_level"].transform([req['experience_level']])[0],
            encoders["employment_type"].transform([req['employment_type']])[0],
            encoders["job_title"].transform([req['job_title'].lower()])[0],
            encoders["employee_residence"].transform(["US"])[0], # Defaulting to US for simplicity
            encoders["company_location"].transform(["US"])[0],   # Defaulting to US for simplicity
            encoders["company_size"].transform([req['company_size']])[0]
        ]
        
        # 2. Scale the features
        features_scaled = scaler.transform([features])
        
        # 3. Predict
        prediction = model.predict(features_scaled)
        
        return jsonify({"salary": round(prediction[0], 2)})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)