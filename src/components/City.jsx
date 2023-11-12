import { useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCities } from "../contexts/CitiesContextWithReducer";
import { useEffect } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // const [searchParams, setSearchParams] = useSearchParams();

  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  /*now that the function getcity has been memoized, the calls for the getCity are not infinite
   and it runs only once, before memoization each update in the current state caused by the function 
    getcity caused the context to rerender as it is at the topmost level, now each rerender of the context
    caused the un-memoized functions to get created again , hence a new function, each new function now passed  as prop
    to the context caused the child components to rerender, and since it is inside the dependency array,
    it caused the useEffect in city to run again and the same process repeats, this is an infinite loop,
     which was solved by using the memoized getCity function.
   */
  useEffect(
    function () {
      getCity(id);
    },
    [id, getCity]
  );

  // TEMP DATA
  // const currentCity = {
  //   cityName: "Lisbon",
  //   emoji: "🇵🇹",
  //   date: "2027-10-31T15:59:59.138Z",
  //   notes: "My favorite city so far!",
  // };

  const { cityName, emoji, date, notes } = currentCity;
  if (isLoading) return <Spinner></Spinner>;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton></BackButton>
      </div>
    </div>
  );
}

export default City;
