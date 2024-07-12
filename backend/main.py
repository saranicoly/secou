from fastapi import FastAPI
from elevationAPI import elevation, elevation_along_path
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:8100",  # Origem do seu frontend Ionic
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class TextResponse(BaseModel):
    response: str

@app.post("/endpoint", response_model=TextResponse)
def process_text(request: TextRequest):
    input_text = request.text
    response_text = f"Você enviou: {input_text}"
    return TextResponse(response=response_text)