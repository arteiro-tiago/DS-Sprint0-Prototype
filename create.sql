PRAGMA foreign_keys=OFF;
.headers on
.mode column

CREATE TABLE people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT
);

CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT
);

CREATE TABLE publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    venue TEXT NOT NULL
);

CREATE TABLE project_members (
    project_id INTEGER,
    person_id INTEGER,
    contribution_role TEXT,
    PRIMARY KEY (project_id, person_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

CREATE TABLE publication_authors (
    publication_id INTEGER,
    person_id INTEGER,
    PRIMARY KEY (publication_id, person_id),
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);


INSERT INTO people (name, role, department, email) VALUES 
('Ana Silva', 'Principal Investigator', 'Computer Science', 'ana.silva@univ.pt'),
('Carlos Mendes', 'PhD Student', 'Computer Science', 'carlos.mendes@univ.pt'),
('Beatriz Costa', 'PostDoc Researcher', 'Data Science', 'beatriz.costa@univ.pt'),
('João Santos', 'Professor', 'Artificial Intelligence', 'joao.santos@univ.pt');

INSERT INTO projects (title, status, start_date, end_date) VALUES 
('AI for Healthcare', 'Active', '2024-01-01', '2026-12-31'),
('Smart Cities Graph', 'Completed', '2022-03-01', '2024-03-01'),
('Quantum ML', 'Active', '2025-06-01', '2028-05-31');


INSERT INTO publications (title, year, venue) VALUES 
('Deep Learning in Clinical Trials', 2025, 'IEEE Medical Imaging'),
('Urban Traffic Flow Prediction using GNNs', 2023, 'Smart Cities Journal'),
('Collaborative AI Frameworks', 2024, 'ICML Conference');

INSERT INTO project_members (project_id, person_id, contribution_role) VALUES 
(1, 1, 'Project Leader'),
(1, 2, 'Lead Developer'),
(1, 3, 'Researcher'),
(2, 2, 'Data Analyst'),
(2, 4, 'Advisor'),
(3, 1, 'Co-Coordinator'),
(3, 3, 'Lead Researcher');

INSERT INTO publication_authors (publication_id, person_id) VALUES 
(1, 1), (1, 2), (1, 3),
(2, 2), (2, 4),
(3, 1), (3, 3);