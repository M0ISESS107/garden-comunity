from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Usuario,
    Familia,
    Canteiro,
    Mutirao,
    PresencaMutirao,
    Producao,
    Distribuicao,
    Relatorio,
    User
)


# ---------------------------------------------------------
# User (nativo do Django)
# ---------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


# ---------------------------------------------------------
# Usuario (perfil do usuário)
# ---------------------------------------------------------
class UsuarioSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Mostra dados completos do User

    class Meta:
        model = Usuario
        fields = ['id', 'user', 'tipo', 'telefone']


# Caso queira permitir criação via API:
class UsuarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['user', 'tipo', 'telefone']


# ---------------------------------------------------------
# Família
# ---------------------------------------------------------
class FamiliaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Familia
        fields = '__all__'


# ---------------------------------------------------------
# Canteiro
# ---------------------------------------------------------
class CanteiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canteiro
        fields = '__all__'


# ---------------------------------------------------------
# Mutirão
# ---------------------------------------------------------
class MutiraoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mutirao
        fields = '__all__'


# ---------------------------------------------------------
# Presença em Mutirão
# ---------------------------------------------------------
class PresencaMutiraoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    mutirao = MutiraoSerializer(read_only=True)

    class Meta:
        model = PresencaMutirao
        fields = '__all__'


class PresencaMutiraoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PresencaMutirao
        fields = ['usuario', 'mutirao', 'funcao']


# ---------------------------------------------------------
# Produção
# ---------------------------------------------------------
class ProducaoSerializer(serializers.ModelSerializer):
    canteiro = CanteiroSerializer(read_only=True)

    class Meta:
        model = Producao
        fields = '__all__'


class ProducaoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producao
        fields = ['canteiro', 'data_colheita', 'quantidade', 'unidade', 'observacoes']


# ---------------------------------------------------------
# Distribuição
# ---------------------------------------------------------
class DistribuicaoSerializer(serializers.ModelSerializer):
    producao = ProducaoSerializer(read_only=True)
    familia = FamiliaSerializer(read_only=True)

    class Meta:
        model = Distribuicao
        fields = '__all__'


class DistribuicaoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distribuicao
        fields = ['producao', 'familia', 'quantidade_recebida', 'unidade']
# Relatório - Serializer Completo (com dados aninhados)
# ---------------------------------------------------------
class RelatorioSerializer(serializers.ModelSerializer):
    mutirao = serializers.StringRelatedField()
    canteiro = serializers.StringRelatedField()
    producao = serializers.StringRelatedField()

    class Meta:
        model = Relatorio
        fields = [
            'id',
            'titulo',
            'descricao',
            'arquivo_pdf',
            'dados_nutricionais',
            'dados_ambientais',
            'mutirao',
            'canteiro',
            'producao',
            'data_criacao'
        ]


# ---------------------------------------------------------
# Relatório - Serializer para criação/edição
# ---------------------------------------------------------
class RelatorioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relatorio
        fields = [
            'titulo',
            'descricao',
            'arquivo_pdf',
            'dados_nutricionais',
            'dados_ambientais',
            'mutirao',
            'canteiro',
            'producao'
        ]