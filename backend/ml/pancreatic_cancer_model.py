import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder

headlines = ["sample_id", "patient_cohort", "sample_origin", "age", "sex", "diagnosis", "stage",
             "benign_sample_diagnosis", "plasma_CA19_9", "creatinine", "LYVE1", "REG1B", "TFF1", "REG1A"]
df_pancreatic = pd.read_csv('resources/pancreatic_cancer_dataset.csv', names=headlines, skiprows=1)

df_pancreatic.drop(columns=["sample_id", "patient_cohort", "sample_origin"], inplace=True) #dropuje kolumny ktore nie maja wplywu na diagnoze

df_pancreatic.fillna(0, inplace=True) #uzupelnia brakujace wartosci zerami (nan -> 0)
df_pancreatic['benign_sample_diagnosis'] = df_pancreatic['benign_sample_diagnosis'].astype(str)
df_pancreatic['stage'] = df_pancreatic['stage'].astype(str) #zmieniam typ danych na string
label_encoder = LabelEncoder()
df_pancreatic['benign_sample_diagnosis'] = label_encoder.fit_transform(df_pancreatic['benign_sample_diagnosis'])
df_pancreatic['sex'] = label_encoder.fit_transform(df_pancreatic['sex'])
df_pancreatic['stage'] = label_encoder.fit_transform(df_pancreatic['stage']) #zmieniam stringi na liczby za pomoca label encodera

new_sample = df_pancreatic.iloc[572].to_frame().T #to jest symulacja nowej probki bo nie wiem jak to bedzie dodawane przez api
new_sample_x = new_sample.drop(columns=["diagnosis"])
new_sample_y = new_sample["diagnosis"]

pancreatic_x = df_pancreatic.drop(columns=["diagnosis"])
pancreatic_y = df_pancreatic["diagnosis"]

scaler = StandardScaler()
pancreatic_x = scaler.fit_transform(pancreatic_x)
new_sample_x = scaler.transform(new_sample_x)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(pancreatic_x, pancreatic_y)

y_pred_pancreatic = knn.predict(new_sample_x)

accuracy = accuracy_score(new_sample_y, y_pred_pancreatic)
#
print(y_pred_pancreatic)
print(accuracy)

if y_pred_pancreatic == 3: #tu sie zaczyna druga klasyfikacja
    new_sample_second_classification_x = new_sample.drop(columns=["stage"]) #to jest dalej symulacja nowej probki (tej samej co w 1 klasyfikacji) bo nie wiem jak to bedzie dodawane przez api
    new_sample_second_classification_y = new_sample["stage"]

    df_second = df_pancreatic[df_pancreatic["diagnosis"] == 3] #tutaj ucinam dataframe tylko do tych wierszy co maja diagnosis 3 i tym samym maja jakas wartosc stage
    pancreatic_x_second_classification = df_second.drop(columns=["stage"])
    pancreatic_y_second_classification = df_second["stage"]

    scaler2 = StandardScaler()
    pancreatic_x_second_classification = scaler2.fit_transform(pancreatic_x_second_classification)
    new_sample_second_classification_x = scaler2.transform(new_sample_second_classification_x)

    knn.fit(pancreatic_x_second_classification, pancreatic_y_second_classification)

    y_pred_pancreatic_second_classification = knn.predict(new_sample_second_classification_x)

    accuracy_second_classification = accuracy_score(new_sample_second_classification_y,
                                                    y_pred_pancreatic_second_classification)

    print(y_pred_pancreatic_second_classification)
    print(accuracy_second_classification)
