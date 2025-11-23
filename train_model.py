# train_model.py
import kagglehub
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor

# 1. Load Data
print("Downloading data...")
path = kagglehub.dataset_download('adilshamim8/salaries-for-data-science-jobs')
df = pd.read_csv(os.path.join(path, "salaries.csv"))

# 2. Clean & Preprocess
df.drop_duplicates(inplace=True)
df.dropna(inplace=True)

# Keep top 15 jobs only
df['job_title'] = df['job_title'].str.lower()
top_jobs = df['job_title'].value_counts().head(15).index
df = df[df['job_title'].isin(top_jobs)]

# 3. Encode Categorical Data (And save the encoders!)
categorical_cols = ['experience_level', 'employment_type', 'job_title',
                    'employee_residence', 'company_location', 'company_size']

encoders = {} # We will save this dictionary
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le  # Store the encoder for later use

# 4. Train Model
# STRICTLY select only the columns we have in our App
X = df[categorical_cols]
y = df["salary_in_usd"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestRegressor(n_estimators=100, random_state=537)
model.fit(X_scaled, y)
print("Model trained successfully!")

# 5. SAVE EVERYTHING (The "Brain")
artifacts = {
    "model": model,
    "scaler": scaler,
    "encoders": encoders,
    "top_jobs": list(top_jobs) # Save valid job titles for the dropdown menu
}
joblib.dump(artifacts, "salary_model_data.pkl")
print("Model and data saved to 'salary_model_data.pkl'")