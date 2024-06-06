import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder

def classify_sample(sample):
    headlines = ["sample_id", "patient_cohort", "sample_origin", "age", "sex", "diagnosis", "stage",
                "benign_sample_diagnosis", "plasma_CA19_9", "creatinine", "LYVE1", "REG1B", "TFF1", "REG1A"]
    df_pancreatic = pd.read_csv('knn/resources/pancreatic_cancer_dataset.csv', names=headlines, skiprows=1)

    df_pancreatic.drop(columns=["sample_id", "patient_cohort", "sample_origin"], inplace=True) #dropuje kolumny ktore nie maja wplywu na diagnoze

    df_pancreatic.fillna(0, inplace=True) #uzupelnia brakujace wartosci zerami (nan -> 0)
    df_pancreatic['benign_sample_diagnosis'] = df_pancreatic['benign_sample_diagnosis'].astype(str)
    df_pancreatic['stage'] = df_pancreatic['stage'].astype(str) #zmieniam typ danych na string
    benign_sample_diagnosis_encoder = LabelEncoder()
    df_pancreatic['benign_sample_diagnosis'] = benign_sample_diagnosis_encoder.fit_transform(df_pancreatic['benign_sample_diagnosis'])
    
    sex_encoder = LabelEncoder()
    df_pancreatic['sex'] = sex_encoder.fit_transform(df_pancreatic['sex'])

    stage_encoder = LabelEncoder()
    df_pancreatic['stage'] = stage_encoder.fit_transform(df_pancreatic['stage'])



    new_sample = pd.DataFrame([sample], columns=df_pancreatic.columns)
    new_sample.fillna(0, inplace=True)

    
    # IF THERE WILL BE NEW VALUE IT WILL CAUSE ERROR
    new_sample['benign_sample_diagnosis'] = benign_sample_diagnosis_encoder.transform(new_sample['benign_sample_diagnosis'].astype(str))
    new_sample['sex'] = sex_encoder.transform(new_sample['sex'])
    new_sample['stage'] = stage_encoder.transform(new_sample['stage'])

    
    new_sample_x = new_sample.drop(columns=["diagnosis"])
    pancreatic_x = df_pancreatic.drop(columns=["diagnosis"])
    pancreatic_y = df_pancreatic["diagnosis"]

    scaler = StandardScaler()
    pancreatic_x = scaler.fit_transform(pancreatic_x)
    new_sample_x = scaler.transform(new_sample_x)

    knn = KNeighborsClassifier(n_neighbors=3)
    knn.fit(pancreatic_x, pancreatic_y)

    y_pred_pancreatic = knn.predict(new_sample_x)[0]
    y_pred_pancreatic_second_classification = None


    if y_pred_pancreatic == 3: #tu sie zaczyna druga klasyfikacja
        new_sample_second_classification_x = new_sample.drop(columns=["stage"]) #to jest dalej symulacja nowej probki (tej samej co w 1 klasyfikacji) bo nie wiem jak to bedzie dodawane przez api

        df_second = df_pancreatic[df_pancreatic["diagnosis"] == 3] #tutaj ucinam dataframe tylko do tych wierszy co maja diagnosis 3 i tym samym maja jakas wartosc stage
        pancreatic_x_second_classification = df_second.drop(columns=["stage"])
        pancreatic_y_second_classification = df_second["stage"]

        scaler2 = StandardScaler()
        pancreatic_x_second_classification = scaler2.fit_transform(pancreatic_x_second_classification)
        new_sample_second_classification_x = scaler2.transform(new_sample_second_classification_x)

        knn.fit(pancreatic_x_second_classification, pancreatic_y_second_classification)

        y_pred_pancreatic_second_classification = knn.predict(new_sample_second_classification_x)[0]


    return y_pred_pancreatic, y_pred_pancreatic_second_classification