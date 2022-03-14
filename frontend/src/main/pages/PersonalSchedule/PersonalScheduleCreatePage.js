import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalScheduleForm from "main/components/PersonalSchedule/PersonalScheduleForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import { toast } from "react-toastify";

export default function PersonalScheduleCreatePage() {
  const currentUser = useCurrentUser();

  const objectToAxiosParams = (personalschedule) => ({
    url: "/api/PersonalSchedules/post",
    method: "POST",
    params: {
      user: personalschedule.user,
      name: personalschedule.name,
      description: personalschedule.description,
      quarterYYYYQ: personalschedule.quarterYYYYQ,
    },
  });

  const onSuccess = (personalschedule) => {
    toast(`New personalschedule Created - name: ${personalschedule.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/PersonalSchedules/all"]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  if (isSuccess) {
    return <Navigate to="/personalschedule/list" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create a new personal schedule</h1>
        <PersonalScheduleForm submitAction={onSubmit} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
