import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalScheduleForm from "main/components/PersonalSchedule/PersonalScheduleForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function PersonalSchedulesEditPage() {
  let { id } = useParams();

  const {
    data: PersonalSchedule,
    error: error,
    status: status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/PersonalSchedules?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/PersonalSchedules`,
      params: {
        id,
      },
    }
  );

  const objectToAxiosPutParams = (PersonalSchedule) => ({
    url: "/api/PersonalSchedules",
    method: "PUT",
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

  console.log(PersonalSchedule);

  const onSuccess = (PersonalSchedule) => {
    toast(`PersonalSchedule Updated - id: ${PersonalSchedule.id} name: ${PersonalSchedule.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/PersonalSchedules?id=${id}`]
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
          />
        )}
      </div>
    </BasicLayout>
  );
}
