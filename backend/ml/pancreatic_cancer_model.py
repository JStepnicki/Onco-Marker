import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder

headlines = ["sample_id", "patient_cohort", "sample_origin", "age", "sex", "diagnosis", "stage",
             "benign_sample_diagnosis", "plasma_CA19_9", "creatinine", "LYVE1", "REG1B", "TFF1", "REG1A"]
df_pancreatic = pd.read_csv('resources/pancreatic_cancer_dataset.csv', names=headlines, skiprows=1)

df_pancreatic.drop(columns=["sample_id", "patient_cohort", "sample_origin"], inplace=True)

df_pancreatic.fillna(0, inplace=True)
df_pancreatic['benign_sample_diagnosis'] = df_pancreatic['benign_sample_diagnosis'].astype(str)
df_pancreatic['stage'] = df_pancreatic['stage'].astype(str)
label_encoder = LabelEncoder()
df_pancreatic['benign_sample_diagnosis'] = label_encoder.fit_transform(df_pancreatic['benign_sample_diagnosis'])
df_pancreatic['sex'] = label_encoder.fit_transform(df_pancreatic['sex'])
df_pancreatic['stage'] = label_encoder.fit_transform(df_pancreatic['stage'])

pancreatic_x = df_pancreatic.drop(columns=["diagnosis"])
pancreatic_y = df_pancreatic["diagnosis"]

pancreatic_train_x, pancreatic_test_x, pancreatic_train_y, pancreatic_test_y = train_test_split(pancreatic_x,
                                                                                                pancreatic_y,
                                                                                                test_size=0.3,
                                                                                                random_state=1,
                                                                                                )

scaler = StandardScaler()
pancreatic_train_x = scaler.fit_transform(pancreatic_train_x)
pancreatic_test_x = scaler.transform(pancreatic_test_x)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(pancreatic_train_x, pancreatic_train_y)

y_pred_pancreatic = knn.predict(pancreatic_test_x)

accuracy = accuracy_score(pancreatic_test_y, y_pred_pancreatic)

print(accuracy)