import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ApiDetail from './components/ApiDetail';
import { ApiDetailType } from './types';

const App: React.FC = () => {
  const [apiData, setApiData] = useState<ApiDetailType[]>([]);
  const [selectedApi, setSelectedApi] = useState<ApiDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the API data from the JSON file located in the public folder
    fetch('/apiData.json')
      .then((response) => response.json())
      .then((data: ApiDetailType[]) => {
        setApiData(data);
        if (data.length > 0) {
          setSelectedApi(data[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching API data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading API data...</div>;
  }

  return (
    <div className="container">
      <Sidebar 
        apis={apiData} 
        selectedApiId={selectedApi?.id} 
        onSelect={(api) => setSelectedApi(api)} 
      />
      <div className="content">
        {selectedApi ? (
          <ApiDetail api={selectedApi} />
        ) : (
          <div>Select an API to view details</div>
        )}
      </div>
    </div>
  );
};

export default App;
