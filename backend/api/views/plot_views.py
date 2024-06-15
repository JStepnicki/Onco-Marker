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

    # Fetch the specific patient's sample
    sample = get_object_or_404(CancerSample, id=sample_id)
    organ_type = sample.organ_type
    sample_markers = sample.markers_JSON

    # Fetch all samples of the same organ type
    all_samples = CancerSample.objects.filter(organ_type=organ_type)

    # Prepare data for the radar chart
    categories = list(sample_markers.keys())
    num_vars = len(categories)

    # Create radar chart
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

    # Function to calculate average marker values for a given diagnosis
    def calculate_avg_values(diagnosis):
        diagnosis_samples = all_samples.filter(diagnosis=diagnosis)
        avg_values = {key: 0 for key in categories}
        count_valid_samples = 0

        for ds in diagnosis_samples:
            for key in ds.markers_JSON:
                if key in avg_values and isinstance(ds.markers_JSON[key], (int, float)) and not np.isnan(ds.markers_JSON[key]):
                    avg_values[key] += ds.markers_JSON[key]
            count_valid_samples += 1  # Increment count for each valid sample

        if count_valid_samples > 0:
            avg_values = {k: v / count_valid_samples for k, v in avg_values.items()}
        else:
            avg_values = {k: 0 for k in avg_values}

        return avg_values

    # Plot average values for diagnoses "1" (healthy) and "3" (diagnosed cancer)
    colors = ['green', 'red']  # Define colors for healthy and cancer
    labels = ["healthy", "diagnosed cancer"]

    for i, (diagnosis, label) in enumerate([(1, "healthy"), (3, "diagnosed cancer")]):
        avg_values = calculate_avg_values(diagnosis)
        values = [avg_values[key] if key in avg_values else 0 for key in categories]
        values.append(values[0])  # Close the circle

        ax.plot(angles, values, linewidth=1, linestyle='solid', label=label, color=colors[i])
        ax.fill(angles, values, alpha=0.1, color=colors[i])

    # Set up the rest of the chart
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)

    # Plot values for the specific patient's sample without checks
    patient_values = [sample_markers.get(key, 0) for key in categories]
    patient_values.append(patient_values[0])  # Close the circle

    ax.plot(angles, patient_values, linewidth=2, linestyle='dashed', label='patient sample', color='blue')
    ax.fill(angles, patient_values, 'b', alpha=0.1)

    plt.legend(loc='upper right', bbox_to_anchor=(0.2, 0.2))

    # Apply logarithmic scale to radial axis
    ax.set_rscale('log')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plot_data = buffer.getvalue()
    buffer.close()

    plot = base64.b64encode(plot_data).decode()

    return Response({"plot": plot})
