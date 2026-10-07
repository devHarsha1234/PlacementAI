# AI-Based Student Placement Prediction and Career Readiness System

## 1. Project Title
AI-Based Student Placement Prediction and Career Readiness System

## 2. Problem Statement
Many students face uncertainty regarding their placement prospects despite their academic and extracurricular efforts. An automated system that evaluates a student's profile and predicts their likelihood of placement can help identify areas of improvement and prepare them for career success.

## 3. Objective
To build a machine learning pipeline that predicts whether a student will be placed or not based on academic, technical, and extracurricular features. The system also provides a web interface for students to input their details and receive predictions along with career recommendations.

## 4. Dataset Source
Kaggle: "Binary Classification of Student Placement Outcomes"

## 5. Dataset Description
The train.csv dataset contains 8,000 labeled records with information about various student attributes, including academic scores, technical skills, internships, and extracurricular activities. It is a binary classification dataset where the target variable indicates placement success.

## 6. Features
To provide a streamlined User Experience without overwhelming the student, the model was engineered to use a focused subset of 13 highly impactful features:
- **Academic**: CGPA, Attendance Percentage, Backlogs
- **Technical**: Coding Score, Technical Score, Aptitude Score, Preferred Domain
- **Experience**: Projects Count, Internships Count, Hackathons Participated
- **Soft Skills**: Communication Score, Mock Interview Score, Leadership Score

## 7. Target Variable
`placed`: Binary variable (1 = Placed, 0 = Not Placed)

## 8. Data Preprocessing
- Removed identifier columns like `student_id`.
- Handled missing values using Median Imputation for numerical features and Most Frequent for categorical features.
- Categorical variables were encoded using `OneHotEncoder`.
- Numerical variables were scaled using `StandardScaler`.

## 9. Exploratory Data Analysis
EDA was performed to understand the distribution of features, identify outliers, and check for class imbalance.

## 10. Machine Learning Algorithms
The following models were trained and evaluated:
- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- K-Nearest Neighbors (KNN)

## 11. Model Evaluation
Models were evaluated using cross-validation. The metrics collected include Accuracy, Precision, Recall, F1-score, and ROC-AUC.

## 12. Model Comparison
The dataset exhibits severe class imbalance. A comparative analysis was performed using `class_weight='balanced'`. Logistic Regression performed the best and generalized well to unseen data, yielding the best F1-score.

## 13. Final Model Selection
**Logistic Regression** was selected as the final model due to its robust performance on the imbalanced dataset and its inherent explainability (via coefficients).

## 14. Hyperparameter Tuning
GridSearchCV was used to tune the hyperparameters of the selected best model to optimize its performance further.

## 15. Explainable ML
The prediction system uses model coefficients derived from the Logistic Regression model to provide users with an explanation of which factors strongly influence their prediction.

## 16. System Architecture
`	ext
Kaggle Dataset
       |
Data Cleaning & EDA
       |
Preprocessing (Imputation & Scaling)
       |
Train/Test Split
       |
Multiple ML Models Evaluated
       |
Best Model Selected
       |
Joblib Pipeline Serialization
       |
Flask REST API
       |
React Frontend
       |
Student Prediction
`

## 17. Frontend-Backend Integration
A React frontend communicates with a Flask backend via a REST API (`/api/predict`). The backend loads the serialized `joblib` model pipeline to process incoming JSON requests and return predictions.

## 18. How Prediction Works
1. Student inputs data into the React form.
2. Data is sent to the Flask API.
3. Flask validates and formats the data into a Pandas DataFrame.
4. The saved Scikit-learn Pipeline applies imputing, scaling, and one-hot encoding.
5. The trained classifier makes a prediction and calculates the probability.
6. The backend generates recommendations if the prediction is "Not Placed" and returns the JSON payload.
7. The frontend displays the result, confidence score, and recommendations.

## 19. Installation
Requires Python 3.8+ and Node.js.

```powershell
# 1. Clone/Navigate to project directory
cd "H:\ML_Mini project"

# 2. Setup Python Backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# 3. Setup React Frontend
cd frontend
npm install
```

## 20. How to Run

**Terminal 1 (Backend):**
```powershell
cd "H:\ML_Mini project"
.\venv\Scripts\activate
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```powershell
cd "H:\ML_Mini project"
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

## 21. Limitations
- Model predictions are based on historical simulated data and do not guarantee real-world placement.
- Simple feature importance explanation does not provide localized SHAP values for each individual prediction (though this can be added).

## 22. Future Scope
- Integration with external career platforms like LinkedIn.
- More granular local explanations using SHAP.
- Allowing continuous model retraining as new placement data comes in.
