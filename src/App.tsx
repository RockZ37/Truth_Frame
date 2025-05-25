import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ArticleAnalysis from './pages/ArticleAnalysis';
import SourceComparison from './pages/SourceComparison';
import Search from './pages/Search';
import About from './pages/About';
import { AnalysisProvider } from './context/AnalysisContext';

function App() {
  return (
    <Router>
      <AnalysisProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analyze" element={<ArticleAnalysis />} />
            <Route path="/compare" element={<SourceComparison />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </AnalysisProvider>
    </Router>
  );
}

export default App;