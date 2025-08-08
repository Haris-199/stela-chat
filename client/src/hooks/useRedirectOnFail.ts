import { useNavigate } from "react-router-dom";
import { APIError, APIResponse, APISuccess } from "../types";

/**
 * Custom hook to handle API responses and redirect on failure.s
 * @returns An object with methods to handle GET and POST requests.
 * - `handleGetReq`: Takes an API response and a redirect path, returns data or redirects.
 * - `handlePostReq`: Takes an API response and a redirect path, redirects on failure.
 */
export default function useRedirectOnFail() {
  const navigate = useNavigate();
  return {
    handleGetReq: <T,>(res: APIResponse<T> | APIError, to = "/login") => {
      if (!res.success) {
        navigate(to);
        return [];
      }
      return res.data;
    },
    handlePostReq: (res: APISuccess | APIError, to = "/login") => {
      if (!res.success) {
        navigate(to);
      }
    },
  };
}
