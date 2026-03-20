# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "status": "ok",
        "message": "DineOps backend is running"
    })


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/menu/', include('apps.menu.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/reservations/', include('apps.reservations.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/accounting/', include('apps.accounting.urls')),
    path('api/receipts/', include('apps.receipts.urls')),
    path('api/hr/', include('apps.hr.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)