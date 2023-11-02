import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
export default function Map() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <h1>
        Pos : {lat}: {lng}
      </h1>
    </div>
  );
}
