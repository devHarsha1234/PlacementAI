from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import json
import os
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and feature info
model_path = os.path.join(os.path.dirname(__file__), '../models/placement_model.joblib')
features_path = os.path.join(os.path.dirname(__file__), '../models/features_info.json')

if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None

if os.path.exists(features_path):
    with open(features_path, 'r') as f:
        features_info = json.load(f)
else:
    features_info = None

@app.route('/api/features', methods=['GET'])
def get_features():
    if not features_info:
        return jsonify({"error": "Features info not found"}), 500
    return jsonify(features_info)

@app.route('/api/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"success": False, "error": "Model not loaded"}), 500
        
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No JSON payload provided"}), 400

        required_cols = features_info['numerical_cols'] + features_info['categorical_cols']
        missing_cols = [col for col in required_cols if col not in data]
        if missing_cols:
            return jsonify({"success": False, "error": f"Missing required fields: {', '.join(missing_cols)}"}), 400
            
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Enforce types for numerical cols
        for col in features_info['numerical_cols']:
            try:
                df[col] = pd.to_numeric(df[col])
            except ValueError:
                return jsonify({"success": False, "error": f"Field '{col}' must be a number"}), 400
                
        # Reorder to match training
        df = df[required_cols]
        
        # Predict
        prediction = model.predict(df)[0]
        
        # Probability
        if hasattr(model.named_steps['classifier'], "predict_proba"):
            proba = model.predict_proba(df)[0]
            placement_prob = proba[1]
        else:
            placement_prob = float(prediction)
            
        result = "Placed" if prediction == 1 else "Not Placed"
        
        # Explanation (Feature Importance or Coefficients)
        explanation = []
        classifier = model.named_steps['classifier']
        preprocessor = model.named_steps['preprocessor']
        
        # Determine model name
        model_name = classifier.__class__.__name__
        
        if hasattr(classifier, 'feature_importances_'):
            importances = classifier.feature_importances_
            cat_encoder = preprocessor.named_transformers_['cat'].named_steps['onehot']
            cat_features = cat_encoder.get_feature_names_out(features_info['categorical_cols'])
            all_features = features_info['numerical_cols'] + list(cat_features)
            
            explanation.append("Model uses feature importances to determine key factors.")
            
            feature_imp = list(zip(all_features, importances))
            feature_imp.sort(key=lambda x: x[1], reverse=True)
            top_features = [f[0] for f in feature_imp[:3]]
            explanation.append(f"Most important factors: {', '.join(top_features)}")
        elif hasattr(classifier, 'coef_'):
            importances = np.abs(classifier.coef_[0])
            cat_encoder = preprocessor.named_transformers_['cat'].named_steps['onehot']
            cat_features = cat_encoder.get_feature_names_out(features_info['categorical_cols'])
            all_features = features_info['numerical_cols'] + list(cat_features)
            
            explanation.append("Model evaluated your profile using weighted feature analysis.")
            
            feature_imp = list(zip(all_features, importances))
            feature_imp.sort(key=lambda x: x[1], reverse=True)
            top_features = [f[0] for f in feature_imp[:3]]
            explanation.append(f"Key drivers for this result: {', '.join(top_features).replace('_', ' ')}")
        else:
            explanation.append("Model does not support direct feature importances.")
            
        recommendations = []
        if prediction == 0:
            if 'coding_score' in data and float(data.get('coding_score', 0)) < 50:
                recommendations.append("Improve coding skills by practicing on platforms like LeetCode or HackerRank.")
            if 'communication_score' in data and float(data.get('communication_score', 0)) < 60:
                recommendations.append("Work on communication skills through mock interviews and speaking exercises.")
            if 'internships_count' in data and int(data.get('internships_count', 0)) == 0:
                recommendations.append("Try to secure at least one internship to gain industry experience.")
                
        if len(recommendations) == 0 and prediction == 0:
             recommendations.append("Focus on improving your overall academic and technical profile.")

        return jsonify({
            "success": True,
            "prediction": result,
            "probability": float(placement_prob),
            "model": model_name,
            "explanation": explanation,
            "recommendations": recommendations,
            "message": "Prediction generated successfully."
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
