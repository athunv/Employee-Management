from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.views import APIView
from .models  import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.


class RegisterView(APIView):
    def post(self, request):

        serializer = EmployerSerializer(data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Employer created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        employers=User.objects.all()
        serializer = EmployerSerializer(employers, many=True)
        return Response(serializer.data)
    

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        return Response({"message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
    
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class DynamicFormViewSet(viewsets.ModelViewSet):
    queryset = DynamicForm.objects.all()
    serializer_class = DynamicFormSerializer


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Validation errors:", serializer.errors)  # Log the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DynamicFormFieldsViewSet(viewsets.ModelViewSet):
    queryset = DynamicFormFields.objects.all()
    serializer_class = DynamicFormFieldsSerializer