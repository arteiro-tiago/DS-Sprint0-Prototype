from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

DATABASE_URL = "postgresql://admin:password@localhost:6767/research_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Association Tables (Many-to-Many with contribution roles)
class ProjectContribution(Base):
    __tablename__ = "project_contributions"
    researcher_id = Column(Integer, ForeignKey("researchers.id"), primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)
    role = Column(String, default="Contributor") # e.g., "Lead Researcher", "Data Analyst"
    
    researcher = relationship("Researcher", back_populates="projects")
    project = relationship("Project", back_populates="contributors")

class PublicationAuthor(Base):
    __tablename__ = "publication_authors"
    researcher_id = Column(Integer, ForeignKey("researchers.id"), primary_key=True)
    publication_id = Column(Integer, ForeignKey("publications.id"), primary_key=True)
    author_order = Column(Integer, default=1) # 1st author, 2nd author, etc.

    researcher = relationship("Researcher", back_populates="publications")
    publication = relationship("Publication", back_populates="authors")

# Core Entities
class Researcher(Base):
    __tablename__ = "researchers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(String)

    projects = relationship("ProjectContribution", back_populates="researcher")
    publications = relationship("PublicationAuthor", back_populates="researcher")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, default="Active")

    contributors = relationship("ProjectContribution", back_populates="project")

class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    year = Column(Integer)

    authors = relationship("PublicationAuthor", back_populates="publication")