import React from 'react';
import Layout from '@/components/layout/Layout';
import CitationGenerator from '@/components/citation/CitationGenerator';

const CitationGeneratorPage: React.FC = () => {
  return (
    <Layout>
      <CitationGenerator />
    </Layout>
  );
};

export default CitationGeneratorPage;