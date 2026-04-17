import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Technical() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/')}>← back</button>
      <h1>Technical Works</h1>
      <p>Software Engineering + Web Dev coming soon.</p>
    </div>
  );
}