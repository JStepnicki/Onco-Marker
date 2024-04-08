from django.db import models

class Test(models.Model):
    title = models.CharField(max_length=255)
    body= models.TextField()


    def __str__(self):
        return f"Test: {self.title}"
    
class Cancer_Sample(models.Model):
    organ_type = models.CharField(max_length=255)
    patient_cohort = models.CharField(max_length=255)
    sample_origin = models.CharField(max_length=255)
    markers_JSON = models.TextField()

    def set_markers(self, markers):
        self.markers_JSON = json.dumps(markers)

    def get_markers(self):
        return json.loads(self.markers_JSON)



class Patient(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    age = models.IntegerField()
    sex = models.BooleanField()
    cancer_samples = models.ManyToManyField(Cancer_Sample)



 


