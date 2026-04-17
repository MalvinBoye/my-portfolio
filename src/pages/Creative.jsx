import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Creative() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/')}>← back</button>
      <h1>Creative Works</h1>
      <p>UX/UI Design + Creative Projects coming soon.</p>
    </div>
  );
}