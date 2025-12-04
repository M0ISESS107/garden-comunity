from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import (
    Usuario,
    Familia,
    Canteiro,
    Mutirao,
    PresencaMutirao,
    Producao,
    Distribuicao,
    Relatorio
)

from .serializers import (
    UserSerializer,
    UsuarioSerializer, UsuarioCreateSerializer,
    FamiliaSerializer,
    CanteiroSerializer,
    MutiraoSerializer,
    PresencaMutiraoSerializer, PresencaMutiraoCreateSerializer,
    ProducaoSerializer, ProducaoCreateSerializer,
    DistribuicaoSerializer, DistribuicaoCreateSerializer,
    RelatorioSerializer, RelatorioCreateSerializer
)


# ---------------------------------------------------------
# User (nativo do Django)
# ---------------------------------------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ---------------------------------------------------------
# Usuario (Perfil extra)
# ---------------------------------------------------------
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()

    def get_serializer_class(self):
        # POST/PUT = CreateSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return UsuarioCreateSerializer
        return UsuarioSerializer


# ---------------------------------------------------------
# Família
# ---------------------------------------------------------
class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer


# ---------------------------------------------------------
# Canteiro
# ---------------------------------------------------------
class CanteiroViewSet(viewsets.ModelViewSet):
    queryset = Canteiro.objects.all()
    serializer_class = CanteiroSerializer


# ---------------------------------------------------------
# Mutirão
# ---------------------------------------------------------
class MutiraoViewSet(viewsets.ModelViewSet):
    queryset = Mutirao.objects.all()
    serializer_class = MutiraoSerializer


# ---------------------------------------------------------
# Presença em Mutirão
# ---------------------------------------------------------
class PresencaMutiraoViewSet(viewsets.ModelViewSet):
    queryset = PresencaMutirao.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PresencaMutiraoCreateSerializer
        return PresencaMutiraoSerializer


# ---------------------------------------------------------
# Produção
# ---------------------------------------------------------
class ProducaoViewSet(viewsets.ModelViewSet):
    queryset = Producao.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProducaoCreateSerializer
        return ProducaoSerializer


# ---------------------------------------------------------
# Distribuição
# ---------------------------------------------------------
class DistribuicaoViewSet(viewsets.ModelViewSet):
    queryset = Distribuicao.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DistribuicaoCreateSerializer
        return DistribuicaoSerializer


# ---------------------------------------------------------
# Relatório (com upload de PDF)
# ---------------------------------------------------------
class RelatorioViewSet(viewsets.ModelViewSet):
    queryset = Relatorio.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RelatorioCreateSerializer
        return RelatorioSerializer
