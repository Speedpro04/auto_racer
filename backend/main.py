from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from middleware import tenant_middleware
from routes import public_routes, admin_routes, auth_routes, payment_routes, auto_video_routes
from config import get_settings
from dotenv import load_dotenv
import os

load_dotenv()

settings = get_settings()

app = FastAPI(
    title="Solara Auto API",
    description="API para plataforma SaaS de revenda de veículos",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else [
        f"https://*.{settings.BASE_DOMAIN}",
        f"https://{settings.BASE_DOMAIN}"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tenant Middleware
app.middleware("http")(tenant_middleware)

os.makedirs("outputs", exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# Routes
app.include_router(public_routes.router, prefix="/api/v1", tags=["public"])
app.include_router(admin_routes.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(payment_routes.router, tags=["payments"])
app.include_router(auto_video_routes.router, prefix="/api/v1/auto-video", tags=["auto-video"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
