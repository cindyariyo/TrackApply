import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(DATABASE_URL)

from sqlalchemy.orm import sessionmaker

SessionLocal = sessionmaker(bind=engine)

def test_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT current_database()"))
        return result.scalar_one()