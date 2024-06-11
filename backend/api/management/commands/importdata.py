import csv

from api.models import CancerSample
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Import data from CSV file into CancerSample model'

    def handle(self, *args, **kwargs):
        file_path = 'knn/resources/pancreatic_cancer_dataset.csv'

        with open(file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                markers = {
                    'plasma_CA19_9': float(row['plasma_CA19_9']) if row['plasma_CA19_9'] else None,
                    'creatinine': float(row['creatinine']) if row['creatinine'] else None,
                    'LYVE1': float(row['LYVE1']) if row['LYVE1'] else None,
                    'REG1B': float(row['REG1B']) if row['REG1B'] else None,
                    'TFF1': float(row['TFF1']) if row['TFF1'] else None,
                    'REG1A': float(row['REG1A']) if row['REG1A'] else None,
                }
                CancerSample.objects.create(
                    patient = None,
                    stage=row['stage'] if row['stage'] else None,
                    benign_sample_diagnosis=row['benign_sample_diagnosis'] if row['benign_sample_diagnosis'] else None,
                    markers_JSON=markers,
                    diagnosis=row['diagnosis'],
                )
