import { useSearchParams } from "react-router-dom";

export function useCustomUrl() {
  const [searchParams] = useSearchParams();
  const latQuery = searchParams.get("lat");
  const lngQuery = searchParams.get("lng");
  return [latQuery, lngQuery];
}
