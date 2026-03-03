import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WebDev() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/')}>← back</button>
      <h1>WebDev</h1>
      <p>Projects coming soon.</p>
    </div>
  );
}