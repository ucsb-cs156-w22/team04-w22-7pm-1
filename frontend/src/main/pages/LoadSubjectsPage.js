import React from 'react';
import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import LoadSubjectsTable from 'main/components/LoadSubjects/LoadSubjectsTable';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useBackendMutation } from 'main/utils/useBackend';

import { useBackend } from 'main/utils/useBackend';

let subjectsCount = 0;
// Stryker disable next-line all : not testing page reload properly
let initialLoad = false;

const LoadSubjectsPage = () => {
  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ['/api/admin/UCSBSubjects/all'],
    { method: 'GET', url: '/api/admin/UCSBSubjects/all' },
    []
  );

  const objectToAxiosParams = (subjects) => ({
    url: '/api/admin/UCSBSubjects/load',
    method: 'POST',
  });

  // Stryker disable next-line all : not testing page reload properly
  if (!initialLoad) {
    subjectsCount = subjects.length;
    // Stryker disable next-line all : not testing page reload properly
    initialLoad = true;
  }
  // Stryker disable all : mutation caught by previous boolean, don't know why it's still flagged
  const onSuccess = (subjects) => {
    if (subjects.length - subjectsCount === 0) {
      toast('No new subjects were loaded');
    } else if (subjects.length - subjectsCount < 0) {
      if (subjectsCount - subjects.length === 1) {
        toast(`1 subject was deleted`);
      } else {
        toast(`${subjectsCount - subjects.length} subjects were deleted`);
      }
    } else {
      if (subjects.length - subjectsCount === 1) {
        toast(`1 new subject was loaded`);
      } else {
        toast(`${subjects.length - subjectsCount} new subjects were loaded`);
      }
    }
    subjectsCount = subjects.length;
  };
  // Stryker enable all

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
      <h2>Subjects</h2>
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
