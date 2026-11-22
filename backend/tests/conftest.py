import os

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

import main
from models import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing")

test_url = make_url(DATABASE_URL).set(database="trackapply_test")

# Safety check: never run destructive tests against the real database.
if test_url.database != "trackapply_test":
    raise RuntimeError("Unsafe test database configuration")

test_engine = create_engine(test_url)
TestSessionLocal = sessionmaker(bind=test_engine)


@pytest.fixture
def client(monkeypatch):
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    # Redirect SessionLocal() calls in main.py to the test database.
    monkeypatch.setattr(main, "SessionLocal", TestSessionLocal)

    with TestClient(main.app) as test_client:
        yield test_client