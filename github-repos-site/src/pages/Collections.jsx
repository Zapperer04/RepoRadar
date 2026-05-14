import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const Collections = () => {
  const collectionData = [
    { id: 1, name: "Project Ideas", count: 3 },
    { id: 2, name: "Learn React", count: 5 },
    { id: 3, name: "AI Tools", count: 8 },
    { id: 4, name: "Contribute Later", count: 2 }
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">📁 Collections</h1>
          <p className="page-subtitle">Organize your saved repositories into curated folders.</p>
        </header>

        <div className="grid-4">
          {collectionData.map(c => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardDescription>
                {c.count} saved repositories
              </CardDescription>
              <CardFooter>
                <Button variant="secondary" style={{ width: '100%' }}>View Collection</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Collections;
