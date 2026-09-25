import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Thinking from './pages/Thinking';
import Works from './pages/Works';
import WorksStack from './pages/WorksStack';
import About from './pages/About';
import Resume from './pages/Resume';
import CaseStudy from './pages/CaseStudy';
import CursorPicker from './CursorPicker';

// react-router doesn't reset scroll position on navigation by default, so
// every page would otherwise open wherever the previous one left off. The
// explicit 'instant' matters: Home.css sets a global `scroll-behavior:
// smooth` (ported from the prototype), which would otherwise turn this into a
// visible scroll-up animation on every navigation.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CursorPicker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thinking" element={<Thinking />} />
        <Route path="/works" element={<Works />} />
        <Route path="/works/stack" element={<WorksStack />} />
        <Route path="/about" element={<About />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/work/stuff" element={<CaseStudy caseId="stuff" />} />
        <Route path="/work/maable" element={<CaseStudy caseId="maable" />} />
        <Route path="/work/maehlo" element={<CaseStudy caseId="maehlo" />} />
        <Route path="/work/connect" element={<CaseStudy caseId="connect" />} />
        <Route path="/work/dormdrop" element={<CaseStudy caseId="dormdrop" />} />
        <Route path="/work/maelo" element={<CaseStudy caseId="maelo" />} />
        <Route path="/work/ev-mart" element={<CaseStudy caseId="evmart" />} />
      </Routes>
    </BrowserRouter>
  );
}
