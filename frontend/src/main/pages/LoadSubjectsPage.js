import React from 'react';
import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import LoadSubjectsTable from 'main/components/LoadSubjects/LoadSubjectsTable';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useBackendMutation } from 'main/utils/useBackend';

import { useBackend } from 'main/utils/useBackend';
const LoadSubjectsPage = () => {
  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ['/api/admin/UCSBSubjects'],
    { method: 'GET', url: '/api/admin/UCSBSubjects/all' },
    []
  );

  const objectToAxiosParams = (subjects) => ({
    url: '/api/admin/UCSBSubjects/load',
    method: 'POST',
  });

  const onSuccess = (subjects) => {
    toast(`${subjects.length} subjects loaded`);
  };
  const postMutation = useBackendMutation(
    objectToAxiosParams,
    {
      onSuccess,
    },
    // Stryker disable next-line all : hard to set up test for caching
    ['/api/admin/UCSBSubjects/all']
  );

  const loadCallback = async (data) => {
    postMutation.mutate(data);
  };

  return (
    <BasicLayout>
      <h2>Load Subjects</h2>
      <LoadSubjectsTable subjects={subjects} />
      <Button
        variant="primary"
        data-testid="subjectsLoad"
        onClick={loadCallback}
      >
        Load Subjects
      </Button>
    </BasicLayout>
  );
};

export default LoadSubjectsPage;
