import pytest
import sys
import os
import json
import pandas as pd
import joblib

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
from app import app, features_info

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_dataset_exists():
    assert os.path.exists('data/raw/train.csv'), "Training dataset missing"
    assert os.path.exists('data/raw/test.csv'), "Testing dataset missing"

def test_model_exists():
    assert os.path.exists('models/placement_model.joblib'), "Model joblib file missing"
    assert os.path.exists('models/features_info.json'), "Features info JSON missing"

def test_features_info_schema():
    assert 'numerical_cols' in features_info
    assert 'categorical_cols' in features_info
    assert len(features_info['numerical_cols']) + len(features_info['categorical_cols']) == 13

def test_api_features(client):
    res = client.get('/api/features')
    assert res.status_code == 200
    data = res.get_json()
    assert 'categorical_options' in data
    assert 'preferred_domain' in data['categorical_options']

def test_api_predict_valid(client):
    payload = {
        "cgpa": 8.0,
        "attendance_percentage": 90,
        "backlogs": 0,
        "coding_score": 80,
        "aptitude_score": 80,
        "technical_score": 85,
        "preferred_domain": "Software Development",
        "projects_count": 2,
        "internships_count": 1,
        "hackathons_participated": 1,
        "communication_score": 75,
        "mock_interview_score": 80,
        "leadership_score": 75
    }
    res = client.post('/api/predict', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'prediction' in data
    assert 'probability' in data
    assert 'explanation' in data

def test_api_predict_missing_fields(client):
    payload = {
        "cgpa": 8.0,
        "preferred_domain": "Software Development"
    }
    res = client.post('/api/predict', json=payload)
    assert res.status_code == 400
    data = res.get_json()
    assert data['success'] is False
    assert "Missing required fields" in data['error']

def test_api_predict_wrong_types(client):
    payload = {
        "cgpa": "eight", # Invalid string instead of number
        "attendance_percentage": 90,
        "backlogs": 0,
        "coding_score": 80,
        "aptitude_score": 80,
        "technical_score": 85,
        "preferred_domain": "Software Development",
        "projects_count": 2,
        "internships_count": 1,
        "hackathons_participated": 1,
        "communication_score": 75,
        "mock_interview_score": 80,
        "leadership_score": 75
    }
    res = client.post('/api/predict', json=payload)
    assert res.status_code == 400
    data = res.get_json()
    assert data['success'] is False
    assert "must be a number" in data['error']
