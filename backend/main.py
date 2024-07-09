from fastapi import FastAPI
from elevationAPI import elevation, elevation_along_path

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}