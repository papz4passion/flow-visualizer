import React from 'react';
import { ApiDetailType } from '../types';
import TransformerFlow from './TransformerFlow';

interface ApiDetailProps {
  api: ApiDetailType;
}

const ApiDetail: React.FC<ApiDetailProps> = ({ api }) => {
  return (
    <div className="api-detail">
      <h2>{api.name}</h2>
      <p>
        <strong>Endpoint:</strong> {api.endpoint}
      </p>

      <section>
        <h3>Request</h3>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {api.request.map((req, index) => (
              <tr key={index}>
                <td>{req.field}</td>
                <td>{req.type}</td>
                <td>{req.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Response</h3>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {api.response.map((res, index) => (
              <tr key={index}>
                <td>{res.field}</td>
                <td>{res.type}</td>
                <td>{res.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Transformers</h3>
        <TransformerFlow transformers={api.transformers} />
      </section>
    </div>
  );
};

export default ApiDetail;
