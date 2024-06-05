import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from api.models import CancerSample


def classify_sample(sample):
    organ_type = sample['organ_type']
    queryset = CancerSample.objects.filter(organ_type=organ_type)

    # Tworzenie DataFrame z pobranych danych z Django
    sample_df = pd.DataFrame(list(queryset.values()))

    # Konwersja markers_JSON na kolumny z cechami
    markers_df = pd.json_normalize(sample_df['markers_JSON'])

    # Usunięcie kolumny 'markers_JSON'
    sample_df.drop(columns=["id", "timestamp", "organ_type", 'patient_id', 'benign_sample_diagnosis','markers_JSON','stage'], inplace=True)
    # Połączenie DataFrame'ów

    sample_df = pd.concat([sample_df, markers_df], axis=1)

    sample_df.fillna(0, inplace=True)
    sample_df = sample_df.apply(pd.to_numeric, errors='coerce')

    X = sample_df.drop(columns=["diagnosis"])
    y = sample_df["diagnosis"]

    # Inicjalizacja klasyfikatora KNN
    knn = KNeighborsClassifier(n_neighbors=3)

    # Dopasowanie modelu do danych
    knn.fit(X, y)

    # Przewidywanie wartości dla próbki
    y_pred = knn.predict(X)[0]
    stage_pred = 0
    if y_pred == 3:
        queryset_second = CancerSample.objects.filter(diagnosis=3, organ_type=organ_type)
        sample_df_second = pd.DataFrame(list(queryset_second.values()))
        markers_df_second = pd.json_normalize(sample_df_second['markers_JSON'])
        sample_df.drop(columns=["id", "timestamp", "organ_type", 'patient_id', 'benign_sample_diagnosis', 'markers_JSON', 'diagnosis'], inplace=True)
        sample_df_second = pd.concat([sample_df_second, markers_df_second], axis=1)
        sample_df_second.fillna(0, inplace=True)
        X = sample_df_second.drop(columns=["stage"])
        y = sample_df_second["stage"]
        knn = KNeighborsClassifier(n_neighbors=3)
        knn.fit(X, y)
        stage_pred = knn.predict(X)[0]

    # Zwrócenie diagnozy
    return y_pred, stage_pred


