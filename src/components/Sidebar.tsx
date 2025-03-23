import React from 'react';
import { ApiDetailType } from '../types';

interface SidebarProps {
  apis: ApiDetailType[];
  selectedApiId?: string;
  onSelect: (api: ApiDetailType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ apis, selectedApiId, onSelect }) => {
  return (
    <div className="sidebar">
      <h2>APIs</h2>
      <ul>
        {apis.map(api => (
          <li 
            key={api.id} 
            className={`api-item ${selectedApiId === api.id ? 'selected' : ''}`}
            onClick={() => onSelect(api)}
          >
            {api.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
