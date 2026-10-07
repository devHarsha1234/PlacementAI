import pandas as pd
import json
import os
import numpy as np

def generate_report(train_path, test_path, report_path):
    df = pd.read_csv(train_path)
    df_test = pd.read_csv(test_path)
    
    report = {
        "files": {
            "train": os.path.basename(train_path),
            "test": os.path.basename(test_path)
        },
        "dimensions": {
            "train_rows": len(df),
            "train_columns": len(df.columns),
            "test_rows": len(df_test),
            "test_columns": len(df_test.columns)
        },
        "column_names": df.columns.tolist(),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "duplicate_records": int(df.duplicated().sum()),
        "unique_values": {col: int(df[col].nunique()) for col in df.columns},
    }
    
    # Identify column types
    categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
    numerical_columns = df.select_dtypes(include=['number']).columns.tolist()
    
    # Target column assumption (from description)
    target_column = 'placed'
    if target_column in df.columns:
        report["target_column"] = target_column
        report["target_class_distribution"] = df[target_column].value_counts().to_dict()
    else:
        report["target_column"] = None
        report["target_class_distribution"] = None

    # Identifiers & Leakage
    report["categorical_columns"] = [c for c in categorical_columns if c != target_column]
    report["numerical_columns"] = [c for c in numerical_columns if c != target_column]
    
    report["identifier_columns"] = [col for col in df.columns if col.endswith('_id') or df[col].nunique() == len(df)]
    report["possible_leakage_columns"] = [col for col in df.columns if 'salary' in col.lower() or 'package' in col.lower() or 'company' in col.lower()]
    
    # Outliers (using IQR for numericals)
    outliers_dict = {}
    for col in report["numerical_columns"]:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        outliers_mask = (df[col] < (Q1 - 1.5 * IQR)) | (df[col] > (Q3 + 1.5 * IQR))
        outliers_dict[col] = int(outliers_mask.sum())
        
    report["outliers"] = outliers_dict
    
    report["suspicious_columns"] = [col for col in df.columns if df[col].isnull().mean() > 0.5] # More than 50% missing
    
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=4)
        
    print(f"Dataset report generated at {report_path}")

if __name__ == "__main__":
    generate_report(
        "../data/raw/train.csv",
        "../data/raw/test.csv",
        "../reports/dataset_report.json"
    )
