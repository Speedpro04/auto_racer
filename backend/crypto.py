import base64
import hashlib
from cryptography.fernet import Fernet, InvalidToken
from config import get_settings


def _fernet() -> Fernet:
    """Deriva uma chave Fernet determinística a partir do JWT_SECRET.
    Assim não é preciso gerenciar um segredo extra — basta o JWT_SECRET já existente."""
    secret = get_settings().JWT_SECRET.encode()
    key = base64.urlsafe_b64encode(hashlib.sha256(secret).digest())
    return Fernet(key)


def encrypt_secret(plaintext: str) -> str:
    """Criptografa um valor sensível (ex: senha pendente) para guardar em repouso."""
    return _fernet().encrypt(plaintext.encode()).decode()


def decrypt_secret(token: str) -> str:
    """Descriptografa um valor. Mantém compatibilidade com registros antigos
    salvos em texto puro (retorna o próprio valor se não for um token válido)."""
    try:
        return _fernet().decrypt(token.encode()).decode()
    except (InvalidToken, ValueError, AttributeError):
        return token
