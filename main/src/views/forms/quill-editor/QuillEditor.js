import React, { useState } from 'react';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import QuillEdit from './QuillEdit';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Quill Editor',
  },
];

const QuillEditor = () => {
  return (
    <PageContainer title="Quill Editor" description="this is Quill Editor page">
      {/* breadcrumb */}
      <Breadcrumb title="Quill Editor" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Quill Editor">
        <QuillEdit />
      </ParentCard>
    </PageContainer>
  );
};

export default QuillEditor;
