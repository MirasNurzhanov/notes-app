from django.shortcuts import render , redirect , HttpResponseRedirect
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.models import User 
from .models import Note
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json


# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    return redirect("login")

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username , password=password)

        if user is not None:
            login(request, user)
            return redirect("dashboard")
        else:
            return render(request, "login.html" , {
                "message": "Invalid credentials."
            })
    return render(request, "notes/login.html")
    
def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if password != confirmation:
            return render(request, "register.html" , {
                "message": "Passwords do not match."
            })
        try:
            user = User.objects.create_user(
            username=username,
            password=password
            )
            login(request, user)
            return redirect("dashboard")
        
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username already taken.."
            })
    return render(request, "notes/register.html")

def logout_view(request):
    logout(request)
    return redirect("login")

def dashboard(request):
    notes = Note.objects.filter(user=request.user)
    return render(request, "notes/dashboard.html" , {
       "notes": notes
    })


def add_note(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        title = data.get("title")
        content = data.get("content")

        if not title or not content:
            return JsonResponse({"error": "Missing data"}, status=400)

        note = Note.objects.create(
            user=request.user,
            title=title,
            content=content
        )

        return JsonResponse({
            "id": note.id,
            "title": note.title,
            "content": note.content
        })

def delete_note(request , note_id):
    if request.method == "POST":
        note = get_object_or_404(Note , id=note_id , user=request.user)
        note.delete()
        return JsonResponse({"message": "The note was deleted.."})
    return HttpResponse(status=400)
    

def update_note(request , note_id):
    if request.method == "POST":
        note = get_object_or_404(Note, id=note_id, user=request.user)
        data = json.loads(request.body)
        note.title = data["new_title"]
        note.content = data["new_content"]
        note.save()
        return JsonResponse({"message": "Note updated successfuly!"})
    return render(request, "notes/edit_note.html" , {
        "note_id": note_id
    })


def toggle_pin(request):
    pass   

    
def search_note(request):
    query = request.GET.get("q", "")

    if query:
        notes = Note.objects.filter(
            user=request.user
        ).filter(
            title__icontains=query
        ) | Note.objects.filter(
            user=request.user,
            content__icontains=query
        )
    else:
        notes = Note.objects.filter(user=request.user)

    data = [
        {
            "id": note.id,
            "title": note.title,
            "content": note.content
        }
        for note in notes
    ]

    return JsonResponse(data, safe=False)

    """
    for note in notes:
        data.append({
           "id": note.id,
           "title": note.title,
           "content": note.content
                              })
    """