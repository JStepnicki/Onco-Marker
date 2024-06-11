import pandas as pd
from api.models import CancerSample
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder


def classify_sample(sample_id, organ_type):
    try:
        sample_from_db = CancerSample.objects.get(id=sample_id)
        sample_markers_df = pd.json_normalize(sample_from_db.get_markers())

        queryset = CancerSample.objects.filter(diagnosis__isnull=False)
        if not queryset.exists():
            return {"error": "No samples available for training."}

        sample_df = pd.DataFrame(list(queryset.values()))

        markers_df = pd.json_normalize(sample_df['markers_JSON'])

        sample_df.drop(columns=["id", "timestamp", "organ_type", 'patient_id', 'benign_sample_diagnosis', 'markers_JSON', 'stage'], inplace=True)
        sample_df = pd.concat([sample_df, markers_df], axis=1)
        sample_df.fillna(0, inplace=True)

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(sample_df.drop(columns=["diagnosis"]))

        X_diagnosis = pd.DataFrame(X_scaled, columns=sample_df.columns[:-1])
        y_diagnosis = sample_df["diagnosis"]

        knn = KNeighborsClassifier(n_neighbors=3)
        knn.fit(X_diagnosis, y_diagnosis)

        sample_markers_df.fillna(0, inplace=True)
        sample_markers_np = sample_markers_df.to_numpy()[0]

        sample_markers_np_scaled = scaler.transform([sample_markers_np])

        y_pred = knn.predict(sample_markers_np_scaled)[0]

        stage_pred = None
        if y_pred == "3":
            queryset_second = CancerSample.objects.filter(diagnosis=3, organ_type=organ_type, stage__isnull=False)
            if not queryset_second.exists():
                return {"error": "No stage samples available for training."}

            sample_df_second = pd.DataFrame(list(queryset_second.values()))
            markers_df_second = pd.json_normalize(sample_df_second['markers_JSON'])
            sample_df_second.drop(columns=["id", "timestamp", "organ_type", 'patient_id', 'benign_sample_diagnosis', 'markers_JSON', 'diagnosis'],
                                  inplace=True)
            sample_df_second = pd.concat([sample_df_second, markers_df_second], axis=1)
            sample_df_second.fillna(0, inplace=True)

            label_encoder = LabelEncoder()
            sample_df_second['stage'] = label_encoder.fit_transform(sample_df_second['stage'])

            X_stage_scaled = scaler.transform(sample_df_second.drop(columns=["stage"]))
            X_stage = pd.DataFrame(X_stage_scaled, columns=sample_df_second.columns[:-1])
            y_stage = sample_df_second["stage"]

            knn_stage = KNeighborsClassifier(n_neighbors=3)
            knn_stage.fit(X_stage, y_stage)

            sample_markers_np_scaled_stage = scaler.transform([sample_markers_np])
            stage_pred_encoded = knn_stage.predict(sample_markers_np_scaled_stage)[0]

            stage_pred = label_encoder.inverse_transform([stage_pred_encoded])[0]

        sample_from_db.diagnosis = y_pred
        sample_from_db.stage = stage_pred
        sample_from_db.save()
        return y_pred, stage_pred

    except CancerSample.DoesNotExist:
        return {"error": "Sample not found."}
    except Exception as e:
        print(e)
        return {"error": str(e)}
