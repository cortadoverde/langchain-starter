"use client";
import { useState, useEffect } from 'react';

export default function AgentsPage() {
  const [packages, setPackages] = useState<{
    userPreferences(userPreferences: any, arg1: null, arg2: number): import("react").ReactNode; topPackageData: any[] 
  }>({
    userPreferences: () => null,
    topPackageData: []
  });

  useEffect(() => {
    async function fetchPackages() {
      const response = await fetch("/api/suggest");
      const data = await response.json();
      setPackages(data);
    }
    
    fetchPackages();
  }, []);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Paquetes mejor rankeados para el pefil</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {packages.topPackageData && packages.topPackageData.map((packageData) => (
          <li key={packageData.id}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold mb-2">{packageData.name}</h2>
              <h2 className="text-lg font-bold mb-2">{packageData.affinity_score}</h2>

              <div className="grid grid-cols-2">

              <pre>{JSON.stringify(packageData.score.scores, null, 2)}</pre>
              <pre>{JSON.stringify(packages.userPreferences, null, 2)}</pre>
              </div>
              
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
