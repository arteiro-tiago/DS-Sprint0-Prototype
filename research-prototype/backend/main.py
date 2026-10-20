from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import Base, engine, SessionLocal, Researcher, Project, Publication, ProjectContribution, PublicationAuthor

# Create tables in Postgres
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Research Collaboration Microservice")

# Allow React frontend to talk to Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Seed dummy data for Sprint 0 on first run
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    if db.query(Researcher).count() == 0:
        r1 = Researcher(name="Dr. Ana Silva", department="AI & Health")
        r2 = Researcher(name="Prof. João Costa", department="Bioinformatics")
        r3 = Researcher(name="Sara Mendes", department="Data Science")

        p1 = Project(title="Neural Networks in Oncology", status="Active")
        p2 = Project(title="Genomic Data Pipeline", status="Completed")

        pub1 = Publication(title="Deep Learning for Tumor Detection", year=2025)
        pub2 = Publication(title="Scalable Genomic Indexing", year=2026)

        db.add_all([r1, r2, r3, p1, p2, pub1, pub2])
        db.commit()

        # Link people to projects & publications
        db.add_all([
            ProjectContribution(researcher_id=r1.id, project_id=p1.id, role="Principal Investigator"),
            ProjectContribution(researcher_id=r3.id, project_id=p1.id, role="ML Engineer"),
            ProjectContribution(researcher_id=r2.id, project_id=p2.id, role="Project Lead"),
            ProjectContribution(researcher_id=r3.id, project_id=p2.id, role="Data Engineer"),
            PublicationAuthor(researcher_id=r1.id, publication_id=pub1.id, author_order=1),
            PublicationAuthor(researcher_id=r3.id, publication_id=pub1.id, author_order=2),
            PublicationAuthor(researcher_id=r2.id, publication_id=pub2.id, author_order=1),
        ])
        db.commit()
    db.close()

@app.get("/api/breakdown")
def get_collaboration_breakdown(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    publications = db.query(Publication).all()

    return {
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "status": p.status,
                "people": [
                    {"id": c.researcher.id, "name": c.researcher.name, "department": c.researcher.department, "role": c.role}
                    for c in p.contributors
                ]
            }
            for p in projects
        ],
        "publications": [
            {
                "id": pub.id,
                "title": pub.title,
                "year": pub.year,
                "authors": [
                    {"id": a.researcher.id, "name": a.researcher.name, "department": a.researcher.department, "order": a.author_order}
                    for a in sorted(pub.authors, key=lambda x: x.author_order)
                ]
            }
            for pub in publications
        ]
    }