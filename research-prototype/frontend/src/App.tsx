import { useEffect, useState } from 'react';

interface Person {
  id: number;
  name: string;
  department: string;
  role?: string;
  order?: number;
}

interface Project {
  id: number;
  title: string;
  status: string;
  people: Person[];
}

interface Publication {
  id: number;
  title: string;
  year: number;
  authors: Person[];
}

interface BreakdownData {
  projects: Project[];
  publications: Publication[];
}

export default function App() {
  const [data, setData] = useState<BreakdownData | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/breakdown')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to fetch:', err));
  }, []);

  if (!data) return <div style={{ padding: 24 }}>Loading research breakdown...</div>;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Research Contributions & Collaborations</h1>
      <p style={{ color: '#555' }}>
        Click on any researcher badge to highlight their collaborations across projects and publications.
      </p>

      {selectedPerson && (
        <div style={{ marginBottom: 20 }}>
          <span>Filtering/Highlighting: <strong>{selectedPerson}</strong> </span>
          <button onClick={() => setSelectedPerson(null)}>Clear</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Projects Column */}
        <div>
          <h2>Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{proj.title}</h3>
                <span style={{ fontSize: 12, background: '#e0f2fe', padding: '2px 8px', borderRadius: 12, height: 'fit-content' }}>
                  {proj.status}
                </span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 4px' }}>Involved Researchers:</p>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {proj.people.map((person) => (
                  <li
                    key={person.id}
                    onClick={() => setSelectedPerson(person.name)}
                    style={{
                      cursor: 'pointer',
                      marginBottom: 4,
                      backgroundColor: selectedPerson === person.name ? '#fef08a' : 'transparent',
                    }}
                  >
                    <strong>{person.name}</strong> ({person.role}) — <small>{person.department}</small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Publications Column */}
        <div>
          <h2>Publications</h2>
          {data.publications.map((pub) => (
            <div key={pub.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{pub.title}</h3>
              <small style={{ color: '#666' }}>Published: {pub.year}</small>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '12px 0 4px' }}>Authors (by contribution order):</p>
              <ol style={{ paddingLeft: 20, margin: 0 }}>
                {pub.authors.map((author) => (
                  <li
                    key={author.id}
                    onClick={() => setSelectedPerson(author.name)}
                    style={{
                      cursor: 'pointer',
                      marginBottom: 4,
                      backgroundColor: selectedPerson === author.name ? '#fef08a' : 'transparent',
                    }}
                  >
                    <strong>{author.name}</strong> — <small>{author.department}</small>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}