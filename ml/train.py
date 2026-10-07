import pandas as pd
import numpy as np
import os
import joblib
import json

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def main():
    print("Loading data...")
    df = pd.read_csv("../data/raw/train.csv")
    
    # 13 features
    selected_features = [
        'cgpa', 'attendance_percentage', 'backlogs',
        'coding_score', 'aptitude_score', 'technical_score', 'preferred_domain',
        'projects_count', 'internships_count', 'hackathons_participated',
        'communication_score', 'mock_interview_score', 'leadership_score',
        'placed'
    ]
    
    df = df[selected_features]
        
    X = df.drop(columns=['placed'])
    y = df['placed']
    
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
    numerical_cols = X.select_dtypes(include=['number']).columns.tolist()
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)
        ]
    )
    
    # Split: 6400 training, 1600 holdout
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        'Decision Tree': DecisionTreeClassifier(random_state=42, class_weight='balanced'),
        'Random Forest': RandomForestClassifier(random_state=42, n_jobs=-1, class_weight='balanced'),
        'SVM': SVC(probability=False, random_state=42, class_weight='balanced'),
        'KNN': KNeighborsClassifier(n_jobs=-1)
    }
    
    cv_results_summary = []
    best_model_name = None
    best_cv_f1 = -1
    
    print("Performing 5-Fold Stratified CV on the training portion...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    for name, model in models.items():
        pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('classifier', model)])
        
        cv_scores = cross_validate(pipeline, X_train, y_train, cv=cv, 
                                   scoring=['accuracy', 'precision', 'recall', 'f1', 'roc_auc'])
        
        mean_acc = cv_scores['test_accuracy'].mean()
        mean_prec = cv_scores['test_precision'].mean()
        mean_rec = cv_scores['test_recall'].mean()
        mean_f1 = cv_scores['test_f1'].mean()
        mean_roc = cv_scores['test_roc_auc'].mean()
        
        cv_results_summary.append({
            "Model": name,
            "CV_Accuracy": float(mean_acc),
            "CV_Precision": float(mean_prec),
            "CV_Recall": float(mean_rec),
            "CV_F1": float(mean_f1),
            "CV_ROC_AUC": float(mean_roc)
        })
        
        if mean_f1 > best_cv_f1:
            best_cv_f1 = mean_f1
            best_model_name = name
            
    with open("../reports/model_comparison.json", "w") as f:
        json.dump(cv_results_summary, f, indent=4)
        
    print(f"Selected Model based on CV F1-score: {best_model_name}")
    
    # Train the best model on the FULL training portion
    final_model = models[best_model_name]
    final_pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('classifier', final_model)])
    final_pipeline.fit(X_train, y_train)
    
    # Evaluate ONCE on the holdout set
    y_pred = final_pipeline.predict(X_test)
    
    if hasattr(final_pipeline.named_steps['classifier'], "predict_proba"):
        y_scores = final_pipeline.predict_proba(X_test)[:, 1]
    elif hasattr(final_pipeline.named_steps['classifier'], "decision_function"):
        y_scores = final_pipeline.decision_function(X_test)
    else:
        y_scores = y_pred

    final_eval = {
        "Accuracy": float(accuracy_score(y_test, y_pred)),
        "Precision": float(precision_score(y_test, y_pred, zero_division=0)),
        "Recall": float(recall_score(y_test, y_pred, zero_division=0)),
        "F1-score": float(f1_score(y_test, y_pred, zero_division=0)),
        "ROC-AUC": float(roc_auc_score(y_test, y_scores)),
        "Confusion_Matrix": confusion_matrix(y_test, y_pred).tolist()
    }
    
    with open("../reports/evaluation.json", "w") as f:
        json.dump(final_eval, f, indent=4)
        
    # Save the pipeline
    joblib.dump(final_pipeline, "../models/placement_model.joblib")
    
    # Save feature meta
    features_info = {
        "numerical_cols": numerical_cols,
        "categorical_cols": categorical_cols,
        "categorical_options": {col: df[col].dropna().unique().tolist() for col in categorical_cols},
        "numerical_ranges": {col: {"min": float(df[col].min()), "max": float(df[col].max())} for col in numerical_cols}
    }
    with open("../models/features_info.json", "w") as f:
        json.dump(features_info, f, indent=4)
        
    print("Methodologically correct training complete. Model saved.")

if __name__ == "__main__":
    main()
