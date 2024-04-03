from django.db import models

class Test(models.Model):
    title = models.CharField(max_length=255)
    body= models.TextField()


    def __str__(self):
        return f"Test: {self.title}"