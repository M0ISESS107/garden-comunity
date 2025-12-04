from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cor.views import *
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'usuario',UsuarioViewSet)
router.register(r'familia',FamiliaViewSet)
router.register(r'canteiro',CanteiroViewSet)
router.register(r'mutirao',MutiraoViewSet)
router.register(r'presencaMutirao',PresencaMutiraoViewSet)
router.register(r'producao',ProducaoViewSet)
router.register(r'distribuicao',DistribuicaoViewSet)
router.register(r'relatorio',RelatorioViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('',TemplateView.as_view(template_name='index.html'), name='home'),
]