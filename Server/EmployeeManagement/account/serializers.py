from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from django.db import transaction


class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 'username', 'email', 'password')

    def create(self, validated_data):
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
        
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('__all__')
class DynamicFormFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicFormFields
        fields = '__all__'


class DynamicFormSerializer(serializers.ModelSerializer):
    fields = DynamicFormFieldsSerializer(many=True)

    class Meta:
        model = DynamicForm
        fields = ['id', 'name', 'fields']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        with transaction.atomic():
            form = DynamicForm.objects.create(**validated_data)
            DynamicFormFields.objects.bulk_create(
                [DynamicFormFields(form=form, **field_data) for field_data in fields_data]
            )
        return form