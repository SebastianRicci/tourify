import './TripPreview.css';
import { AiOutlineCalendar } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../Utils/date';

function TripPreview({ trip }) {
  const navigate = useNavigate();

  const handleTripDetails = () => {
    navigate('/trips/' + trip._id);
  };

  return (
    <div className="trip-preview" onClick={handleTripDetails}>
      <div className="bottom">
        <h1>{trip.trip_name}</h1>
        <h2>
          📍 {trip.stops[0].stop} - {trip.stops[trip.stops.length - 1].stop}
        </h2>
      </div>
      <div className="top">
        <AiOutlineCalendar />
        <h2>
          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
        </h2>
      </div>
    </div>
  );
}

export default TripPreview;
