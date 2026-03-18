# backend/apps/menu/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('categories/',          views.list_categories,  name='list-categories'),
    path('categories/create/',   views.create_category,  name='create-category'),
    path('categories/<int:pk>/', views.manage_category,  name='manage-category'),
    path('items/',               views.list_menu_items,  name='list-menu-items'),
    path('items/<int:pk>/',      views.get_menu_item,    name='get-menu-item'),
    path('items/create/',        views.create_menu_item, name='create-menu-item'),
    path('items/<int:pk>/manage/', views.manage_menu_item, name='manage-menu-item'),
]
