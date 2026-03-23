from django.urls import path
from . import views

urlpatterns = [
    path("" , views.index , name="index"),
    path("login/" , views.login_view , name="login"),
    path("register/" , views.register_view , name="register"),
    path("logout/" , views.logout_view , name="logout") , 
    path("dashboard/" , views.dashboard, name="dashboard"), 
    path("api/add_note/" , views.add_note , name="add_note"), 
    path("delete_note/<int:note_id>/", views.delete_note, name="delete_note"),
    path("update_note/<int:note_id>/", views.update_note, name="update_note"),
    path("api/toggle_pin/" , views.toggle_pin , name="toogle_pin")
]