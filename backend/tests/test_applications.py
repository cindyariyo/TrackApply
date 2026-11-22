def test_create_application(client):
    response = client.post(
        "/applications",
        json={
            "company_name": "Google",
            "job_title": "Software Engineer",
            "status": "Applied",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["company_name"] == "Google"
    assert data["job_title"] == "Software Engineer"
    assert data["status"] == "Applied"
    assert isinstance(data["id"], int)


def test_get_applications(client):
    client.post(
        "/applications",
        json={
            "company_name": "Stripe",
            "job_title": "Backend Engineer",
            "status": "Interview",
        },
    )

    response = client.get("/applications")

    assert response.status_code == 200

    applications = response.json()

    assert len(applications) == 1
    assert applications[0]["company_name"] == "Stripe"


def test_get_nonexistent_application(client):
    response = client.get("/applications/99999")

    assert response.status_code == 404


def test_update_application(client):
    created = client.post(
        "/applications",
        json={
            "company_name": "Microsoft",
            "job_title": "Graduate Engineer",
            "status": "Applied",
        },
    )

    application_id = created.json()["id"]

    response = client.patch(
        f"/applications/{application_id}",
        json={"status": "Interview"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "Interview"


def test_reject_null_company_name(client):
    created = client.post(
        "/applications",
        json={
            "company_name": "Anthropic",
            "job_title": "Junior Developer",
            "status": "Applied",
        },
    )

    application_id = created.json()["id"]

    response = client.patch(
        f"/applications/{application_id}",
        json={"company_name": None},
    )

    assert response.status_code == 422


def test_delete_application(client):
    created = client.post(
        "/applications",
        json={
            "company_name": "Amazon",
            "job_title": "Software Engineer",
            "status": "Interested",
        },
    )

    application_id = created.json()["id"]

    response = client.delete(
        f"/applications/{application_id}"
    )

    assert response.status_code == 204

    # Confirm it was actually deleted.
    get_response = client.get(
        f"/applications/{application_id}"
    )

    assert get_response.status_code == 404