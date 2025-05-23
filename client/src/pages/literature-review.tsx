import React from 'react';
import Layout from '@/components/layout/Layout';
import LiteratureReviewAssistant from '@/components/literature/LiteratureReviewAssistant';

const LiteratureReviewPage: React.FC = () => {
  return (
    <Layout>
      <LiteratureReviewAssistant />
    </Layout>
  );
};

export default LiteratureReviewPage;