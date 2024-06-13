import io
import base64
import numpy as np
import matplotlib.pyplot as plt
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import CancerSample
import matplotlib

@api_view(['GET'])
def radar_chart_view(request, sample_id):


    matplotlib.use('agg')  # Set the backend to Agg

    sample = get_object_or_404(CancerSample, id=sample_id)
    organ_type = sample.organ_type
    sample_markers = sample.markers_JSON

    # Pobierz wszystkie próbki tego samego typu organu
    all_samples = CancerSample.objects.filter(organ_type=organ_type)

    # Przygotuj dane do wykresu radarowego
    categories = list(sample_markers.keys())
    N = len(categories)

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

    # Iteruj tylko po diagnozach 0 i 3
    for diagnosis in [0, 3]:
        diagnosis_str = str(diagnosis)
        diagnosis_samples = all_samples.filter(diagnosis=diagnosis_str)

        if diagnosis_samples.exists():
            avg_values = {key: 0 for key in categories}
            count_valid_samples = 0

            for ds in diagnosis_samples:
                for key in ds.markers_JSON:
                    if key in avg_values and isinstance(ds.markers_JSON[key], (int, float)):
                        if not np.isnan(ds.markers_JSON[key]):
                            avg_values[key] += ds.markers_JSON[key]
                            count_valid_samples += 1

            if count_valid_samples > 0:
                avg_values = {k: v / count_valid_samples for k, v in avg_values.items()}
                values = [avg_values[key] if key in avg_values else 0 for key in categories]
            else:
                values = [0] * len(categories)

            values.append(values[0])  # Zamknij okrąg
            angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
            angles += angles[:1]

            ax.plot(angles, values, linewidth=1, linestyle='solid', label=f'Diagnosis {diagnosis_str}')
            ax.fill(angles, values, alpha=0.1)

    # Dodaj linie dla wybranej próbki (Sample {sample_id})
    values = [sample_markers[key] if key in sample_markers and isinstance(sample_markers[key], (int, float)) and not np.isnan(
        sample_markers[key]) else 0 for key in categories]
    values.append(values[0])  # Zamknij okrąg
    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
    angles += angles[:1]

    ax.plot(angles, values, linewidth=2, linestyle='dashed', label=f'Sample {sample_id}', color='black')
    ax.fill(angles, values, 'b', alpha=0.1)

    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)

    plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))

    # Apply logarithmic scale to radial axis
    ax.set_rscale('log')

#     # Zapisz wykres do pliku
#     filename = f'radar_chart.png'
#     plt.savefig(filename, format='png')
#     plt.close()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plot_data = buffer.getvalue()
    buffer.close()

    plot = base64.b64encode(plot_data).decode()

    return Response({"plot": plot})