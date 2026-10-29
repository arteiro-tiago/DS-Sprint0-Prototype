import os
from datetime import date

import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:password@localhost:5432/workforce_db")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(title="workforce-service", description="High-level people metrics for HumanISE.info")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def run_sql(sql, params=None):
    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
        return conn.execute(sql, params).fetchall()


@app.get("/health")
def health():
    run_sql("SELECT 1")
    return {"status": "ok", "service": "workforce-service"}


@app.get("/api/workforce/summary")
def get_summary():
    return run_sql("""
        SELECT
            COUNT(*) FILTER (WHERE member_status = 'active')                                     AS active_members,
            COUNT(*) FILTER (WHERE member_status = 'active' AND employment_type = 'employee')    AS hired,
            COUNT(*) FILTER (WHERE member_status = 'active' AND employment_type = 'scholarship') AS scholarship_holders,
            COUNT(*) FILTER (WHERE member_status = 'active' AND employment_type = 'contractor')  AS contractors,
            COUNT(*) FILTER (WHERE member_status = 'active' AND role ~* 'research')              AS researchers,
            COUNT(*) FILTER (WHERE member_status = 'former')                                     AS former_members
        FROM researchers
    """)[0]


@app.get("/api/workforce/trend")
def get_trend():
    today = date.today()
    points = []

    for months_ago in range(11, -1, -1):
        year, month = today.year, today.month - months_ago
        if month <= 0:
            year, month = year - 1, month + 12
        day = today if months_ago == 0 else date(year, month, 1)

        counts = run_sql(
            """
            SELECT
                COUNT(DISTINCT r.id)                                                  AS total,
                COUNT(DISTINCT r.id) FILTER (WHERE r.employment_type = 'employee')    AS hired,
                COUNT(DISTINCT r.id) FILTER (WHERE r.employment_type = 'scholarship') AS scholarship_holders,
                COUNT(DISTINCT r.id) FILTER (WHERE r.employment_type = 'contractor')  AS contractors,
                COUNT(DISTINCT r.id) FILTER (WHERE r.role ~* 'research')              AS researchers
            FROM researcher_contracts c
            JOIN researchers r ON r.id = c.researcher_id
            WHERE c.start_date <= %(day)s
              AND (c.end_date IS NULL OR c.end_date >= %(day)s)
            """,
            {"day": day},
        )[0]
        counts["month"] = day.strftime("%b %y")
        points.append(counts)

    return points


@app.get("/api/workforce/roles")
def get_roles():
    return run_sql("""
        SELECT role,
               role ~* 'research' AS is_research,
               COUNT(*)           AS total
        FROM researchers
        WHERE member_status = 'active'
        GROUP BY role
        ORDER BY total DESC, role
    """)


@app.get("/api/workforce/teams")
def get_teams():
    return run_sql("""
        SELECT
            t.name,
            t.status,
            leader.name                                                                    AS leader,
            COUNT(r.id) FILTER (WHERE r.member_status = 'active')                          AS active_members,
            COUNT(r.id) FILTER (WHERE r.member_status = 'active' AND r.role ~* 'research') AS researchers,
            (SELECT COUNT(DISTINCT a.project_id)
               FROM researcher_project_assignments a
               JOIN researchers m ON m.id = a.researcher_id
               JOIN projects p    ON p.id = a.project_id
              WHERE m.team_id = t.id AND p.status = 'active')                              AS active_projects,
            ARRAY(SELECT rt.name
                    FROM team_topics tt
                    JOIN research_topics rt ON rt.id = tt.topic_id
                   WHERE tt.team_id = t.id
                   ORDER BY rt.name)                                                       AS topics
        FROM teams t
        LEFT JOIN researchers leader ON leader.id = t.leader_id
        LEFT JOIN researchers r      ON r.team_id = t.id
        GROUP BY t.id, t.name, t.status, leader.name
        ORDER BY active_members DESC, t.name
    """)


@app.get("/api/workforce/contracts/ending-soon")
def get_contracts_ending_soon():
    return run_sql("""
        SELECT
            r.name,
            r.role,
            t.name                    AS team,
            c.type                    AS contract_type,
            c.end_date,
            c.end_date - CURRENT_DATE AS days_left
        FROM researcher_contracts c
        JOIN researchers r ON r.id = c.researcher_id
        LEFT JOIN teams t  ON t.id = r.team_id
        WHERE c.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 90
        ORDER BY c.end_date
    """)
