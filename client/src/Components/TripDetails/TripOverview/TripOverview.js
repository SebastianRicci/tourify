import './TripOverview.css';
import { GiPathDistance } from 'react-icons/gi';
import { BiTimeFive } from 'react-icons/bi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { GrLocation } from 'react-icons/gr';
import Loading from '../../Loading/Loading';

function TripOverview({ trip, directionsResponse }) {
  const getTotalDistance = () => {
    const units =
      directionsResponse.routes[0].legs[0].distance.text.split(' ')[1];
    const distances = directionsResponse.routes[0].legs.map(
      (leg) => +leg.distance.text.split(' ')[0].split(',').join('')
    );
    return `${distances
      .reduce((prev, cv) => cv + prev, 0)
      .toLocaleString('en-US')} ${units}`;
  };

  const getTotalTime = () => {
    const times = directionsResponse.routes[0].legs.map((leg) =>
      leg.duration.text.split(' ')
    );
    let hours = 0;
    let mins = 0;
    times.forEach((time) => {
      if (time[1].includes('hour')) hours += +time[0];
      else if (time[1].includes('min')) mins += +time[0];

      if (time[3]?.includes('min')) mins += +time[2];
    });

    while (mins >= 60) {
      hours++;
      mins -= 60;
    }

    let resultHrs;
    hours === 1 ? (resultHrs = hours + ' hr') : (resultHrs = hours + ' hrs');
    let resultMins;
    mins === 1 ? (resultMins = mins + ' min') : (resultMins = mins + ' mins');

    if (hours < 1) return `${mins} mins`;
    if (mins === 0) return resultHrs;
    return `${resultHrs} ${resultMins}`;
  };

  const getTotalDays = () => {
    const start = Date.parse(trip.start_date);
    const end = Date.parse(trip.end_date);
    const daysBetween = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return daysBetween === 1 ? `${daysBetween} day` : `${daysBetween} days`;
  };

  console.log('response in overview', directionsResponse);
  if (!directionsResponse) return <Loading />;

  return (
    <div id="overview" className="section">
      <div className="top">
        <div className="widget total-distance">
          <GiPathDistance size="1.25em" />
          <h1>Distance: {getTotalDistance()}</h1>
          <div className="overlay"></div>
        </div>
        <div className="widget total-time">
          <BiTimeFive size="1.25em" />
          <h1>Time: {getTotalTime()}</h1>
          <div className="overlay"></div>
        </div>
      </div>
      <div className="bottom">
        <div className="widget total-days">
          <AiOutlineCalendar size="1.25em" />
          <h1>Trip Days: {getTotalDays()}</h1>
          <div className="overlay"></div>
        </div>
        <div className="widget total-stops">
          <GrLocation size="1.25em" />
          <h1>Road Trip Stops: {trip.stops.length}</h1>
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  );
}

export default TripOverview;
