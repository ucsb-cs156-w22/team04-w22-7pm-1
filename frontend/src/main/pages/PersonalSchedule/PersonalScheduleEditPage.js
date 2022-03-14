import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import { hasRole } from 'main/utils/currentUser';
import { useCurrentUser } from 'main/utils/currentUser';
import { useParams } from 'react-router-dom';
import PersonalScheduleForm from 'main/components/PersonalSchedule/PersonalScheduleForm';
import { Navigate } from 'react-router-dom';
import { useBackend, useBackendMutation } from 'main/utils/useBackend';
import { toast } from 'react-toastify';

export default function PersonalSchedulesEditPage() {
  const currentUser = useCurrentUser();
  let { id } = useParams();

  const {
    data: PersonalSchedule,
    error: error,
    status: status,
  } = useBackend(
    // Stryker disable next-line all: React caching does not need to be tested
    [
      // Stryker disable next-line all
      hasRole(currentUser, 'ROLE_ADMIN')
        ? // Stryker disable next-line all
          `/api/PersonalSchedules/admin?id=${id}`
        : // Stryker disable next-line all
          `/api/PersonalSchedules?id=${id}`,
    ],
    {
      // Stryker disable next-line all
      method: 'GET',
      url: hasRole(currentUser, 'ROLE_ADMIN')
        ? '/api/PersonalSchedules/admin'
        : '/api/PersonalSchedules',
      params: {
        id,
      },
    }
  );

  const objectToAxiosPutParams = (PersonalSchedule) => ({
    url: hasRole(currentUser, 'ROLE_ADMIN')
      ? '/api/PersonalSchedules/admin'
      : '/api/PersonalSchedules',
    method: 'PUT',
    params: {
      id: PersonalSchedule.id,
    },
    data: {
      user: PersonalSchedule.user,
      name: PersonalSchedule.name,
      description: PersonalSchedule.description,
      quarterYYYYQ: PersonalSchedule.quarterYYYYQ,
    },
  });

  // Stryker enable all

  console.log(PersonalSchedule);

  const onSuccess = (PersonalSchedule) => {
    toast(
      `PersonalSchedule Updated - id: ${PersonalSchedule.id} name: ${PersonalSchedule.name}`
    );
    // Stryker disable next-line all: React caching does not need to be tested
    [
      // Stryker disable next-line all
      hasRole(currentUser, 'ROLE_ADMIN')
        ? // Stryker disable next-line all
          `/api/PersonalSchedules/admin?id=${id}`
        : // Stryker disable next-line all
          `/api/PersonalSchedules?id=${id}`,
    ];
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [
      // Stryker disable next-line all
      hasRole(currentUser, 'ROLE_ADMIN')
        ? // Stryker disable next-line all
          `/api/PersonalSchedules/admin?id=${id}`
        : // Stryker disable next-line all
          `/api/PersonalSchedules?id=${id}`,
    ]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return <Navigate to="/personalschedule/list" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit PersonalSchedule</h1>
        {PersonalSchedule && (
          <PersonalScheduleForm
            initialPersonalSchedule={PersonalSchedule}
            submitAction={onSubmit}
            buttonLabel="Update"
            storageQuarter={PersonalSchedule.quarterYYYYQ}
          />
        )}
      </div>
    </BasicLayout>
  );
}
