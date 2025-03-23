import React from 'react';

interface Transformer {
  incomingField: string;
  actualField: string;
}

interface TransformerFlowProps {
  transformers: Transformer[];
}

const TransformerFlow: React.FC<TransformerFlowProps> = ({ transformers }) => {
  return (
    <div className="transformer-flow">
      {transformers.map((tr, index) => (
        <div key={index} className="transformer-flow-item">
          <div className="field-box">{tr.incomingField}</div>
          <div className="arrow">→</div>
          <div className="field-box">{tr.actualField}</div>
        </div>
      ))}
    </div>
  );
};

export default TransformerFlow;
