import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SoftwareEngineering() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/')}>← back</button>
      <h1>Software Engineering</h1>
      <p>Projects coming soon.</p>
    </div>
  );
}