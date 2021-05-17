from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

@api_view(['GET', 'POST'])
def tasks_api_view(request):
    if request.method == "GET":
        tasks = Task.objects.all()
        task_serializer = TaskSerializer(tasks, many=True)
        return Response(task_serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        task_serializer = TaskSerializer(data=request.data)
        if task_serializer.is_valid():
            task_serializer.save()
            return Response(task_serializer.data, status=status.HTTP_201_CREATED)

        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def task_api_view(request, pk):
    task = Task.objects.filter(pk=pk).first()

    if task:

        if request.method == 'GET':
            task_serializer = TaskSerializer(task)
            return Response(task_serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            task_serializer = TaskSerializer(instance=task, data=request.data)
            if task_serializer.is_valid():
                task_serializer.save()
                return Response(task_serializer.data, status=status.HTTP_200_OK)
            return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            task.delete()
            return Response({"message": "Task deleted"}, status=status.HTTP_200_OK)

    return Response({"message": "This task does not exist"}, status=status.HTTP_400_BAD_REQUEST)
