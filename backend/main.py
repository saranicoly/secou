from fastapi import FastAPI
#from elevationAPI import elevation, elevation_along_path
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}