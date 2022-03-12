import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { hasRole } from 'main/utils/currentUser';

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message.message);
}

export function cellToAxiosParamsDeleteAdmin(cell) {
  return {
    url: '/api/PersonalSchedules/admin',
    method: 'DELETE',
    params: {
      id: cell.row.values.id,
    },
  };
}

export function cellToAxiosParamsDeleteUser(cell) {
  return {
    url: '/api/PersonalSchedules/',
    method: 'DELETE',

    params: {
      id: cell.row.values.id,
    },
  };
}
