from django.db import models

# Create your models here.


class Employee(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=20)
    position = models.CharField(max_length=100)



class DynamicForm(models.Model):
    name = models.CharField(max_length=100)



class DynamicFormFields(models.Model):
    form = models.ForeignKey(DynamicForm, related_name='fields', on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.label} ({self.field_type})"