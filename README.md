1. Base de dados: 
    docker compose up -d workforce-db
2. Backend:

   - cd backend
   - python -m venv .venv
   - source .venv/bin/activate
   - pip install -r requirements.txt
   - uvicorn main:app --reload

3. Frontend:

   - cd frontend
   - npm install
   - npm run dev
