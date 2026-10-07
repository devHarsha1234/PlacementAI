import requests
import json

url = 'http://127.0.0.1:5000/api/predict'
data = {
    "age": 22,
    "gender": "Male",
    "cgpa": 8.5,
    "attendance_percentage": 90,
    "backlogs": 0,
    "coding_score": 85,
    "aptitude_score": 80,
    "communication_score": 75,
    "technical_score": 88,
    "projects_count": 3,
    "major_projects": 1,
    "internships_count": 2,
    "internship_months": 6,
    "certifications_count": 2,
    "hackathons_participated": 3,
    "hackathons_won": 1,
    "coding_platform_score": 900,
    "github_projects": 5,
    "linkedin_score": 80,
    "resume_score": 85,
    "soft_skills_score": 70,
    "leadership_score": 75,
    "extracurricular_score": 60,
    "training_hours": 120,
    "mock_interview_score": 85,
    "preferred_domain": "Data Science"
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response Body:", json.dumps(response.json(), indent=4))
except Exception as e:
    print("Error:", e)
