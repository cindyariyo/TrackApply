from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from sqlalchemy import select
from database import SessionLocal
from models import Application
from fastapi import HTTPException
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, model_validator


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

@app.get("/")
def home():
    return {"message": "Welcome to TrackApply!"}


class ApplicationCreate(BaseModel):
    company_name: str = Field(min_length=1, max_length=150)
    job_title: str = Field(min_length=1, max_length=200)
    status: Literal["Interested", "Applied", "Online Assessment", "Interview", "Offer", "Rejected"] 

class ApplicationUpdate(BaseModel):
    company_name: str | None = Field(
        default=None, min_length=1, max_length=150
    )
    job_title: str | None = Field(
        default=None, min_length=1, max_length=200
    )
    status: Literal[
        "Interested",
        "Applied",
        "Online Assessment",
        "Interview",
        "Offer",
        "Rejected"
    ] | None = None
    
    date_applied: date | None = None
    job_url: str | None = None
    location: str | None = Field(default=None, max_length=200)
    salary_range: str | None = None
    notes: str | None = None
    
    @model_validator(mode="before")
    @classmethod
    def reject_null_required_fields(cls, data):
        if isinstance(data, dict):
            required_fields = {
                "company_name",
                "job_title",
                "status",
            }

            for field in required_fields:
                if field in data and data[field] is None:
                    raise ValueError(f"{field} cannot be null")

        return data
    
    
@app.get("/applications")
def get_applications():
    with SessionLocal() as session:
        statement = select(Application)
        results = session.scalars(statement).all()

        return results

@app.post("/applications", status_code=201)
def create_application(application: ApplicationCreate):
    with SessionLocal() as session:
        new_application = Application(**application.model_dump()) #converts to python dict and unpacks values

        session.add(new_application)
        session.commit()
        session.refresh(new_application)

        return new_application

@app.get("/applications/{application_id}")
def get_application(application_id: int):
    with SessionLocal() as session:
        application = session.get(Application, application_id)

        if application is None:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        return application
    
@app.patch("/applications/{application_id}")
def update_applications(
    application_id: int,
    updates: ApplicationUpdate
):
    with SessionLocal() as session:
        application = session.get(Application, application_id)

        if application is None:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        update_data = updates.model_dump(exclude_unset=True) #includes only provided fields
        
        for field, value in update_data.items():
            setattr(application, field, value)

        session.commit()
        session.refresh(application)

        return application
    

@app.delete("/applications/{application_id}", status_code=204)
def delete_application(application_id: int):
    with SessionLocal() as session:
        application = session.get(Application, application_id)

        if application is None:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        session.delete(application)
        session.commit()

        return {"message": "Application deleted successfully"}