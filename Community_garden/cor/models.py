from django.db import models
from django.contrib.auth.models import User


# ---------------------------------------------------------
# Perfil de Usuário (SEPARADO do User)
# ---------------------------------------------------------
class Usuario(models.Model):
    TIPO_USUARIO = (
        ('coordenador', 'Coordenador'),
        ('voluntario', 'Voluntário'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20, choices=TIPO_USUARIO)
    telefone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.tipo})"


# ---------------------------------------------------------
# Família
# ---------------------------------------------------------
class Familia(models.Model):
    nome_familia = models.CharField(max_length=200)
    representante = models.CharField(max_length=200)
    integrantes = models.PositiveIntegerField()

    def __str__(self):
        return self.nome_familia


# ---------------------------------------------------------
# Canteiro
# ---------------------------------------------------------
class Canteiro(models.Model):
    STATUS = (
        ('ativo', 'Ativo'),
        ('manutencao', 'Em manutenção'),
        ('colhido', 'Colhido'),
    )

    identificacao = models.CharField(max_length=100)
    tipo_planta = models.CharField(max_length=100)
    data_plantio = models.DateField()
    previsao_colheita = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS)

    def __str__(self):
        return f"Canteiro {self.identificacao} - {self.tipo_planta}"


# ---------------------------------------------------------
# Mutirão
# ---------------------------------------------------------
class Mutirao(models.Model):
    data = models.DateField()
    atividades = models.TextField()
    observacoes = models.TextField(blank=True)

    def __str__(self):
        return f"Mutirão em {self.data}"


# ---------------------------------------------------------
# Presença em Mutirão (Relacionamento M:N entre Usuario e Mutirão)
# ---------------------------------------------------------
class PresencaMutirao(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    mutirao = models.ForeignKey(Mutirao, on_delete=models.CASCADE)
    funcao = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.usuario} no mutirão {self.mutirao}"


# ---------------------------------------------------------
# Produção (colheita de um canteiro)
# ---------------------------------------------------------
class Producao(models.Model):
    canteiro = models.ForeignKey(Canteiro, on_delete=models.CASCADE)
    data_colheita = models.DateField()
    quantidade = models.FloatField()
    unidade = models.CharField(max_length=20)
    observacoes = models.TextField(blank=True)

    def __str__(self):
        return f"Produção {self.quantidade}{self.unidade} do {self.canteiro}"


# ---------------------------------------------------------
# Distribuição (M:N entre Produção e Família)
# ---------------------------------------------------------
class Distribuicao(models.Model):
    producao = models.ForeignKey(Producao, on_delete=models.CASCADE)
    familia = models.ForeignKey(Familia, on_delete=models.CASCADE)
    quantidade_recebida = models.FloatField()
    unidade = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.familia} recebeu {self.quantidade_recebida}{self.unidade}"
    
# ---------------------------------------------------------
# Relatório (PDF com dados nutricionais e ambientais)
# ---------------------------------------------------------
class Relatorio(models.Model):
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)

    # Arquivo PDF gerado
    arquivo_pdf = models.FileField(upload_to='relatorios/')

    # Dados informativos
    dados_nutricionais = models.TextField(blank=True)
    dados_ambientais = models.TextField(blank=True)

    # Relacionamentos opcionais
    mutirao = models.ForeignKey('Mutirao', on_delete=models.SET_NULL, null=True, blank=True)
    canteiro = models.ForeignKey('Canteiro', on_delete=models.SET_NULL, null=True, blank=True)
    producao = models.ForeignKey('Producao', on_delete=models.SET_NULL, null=True, blank=True)

    # Informações do sistema
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Relatório: {self.titulo}"

