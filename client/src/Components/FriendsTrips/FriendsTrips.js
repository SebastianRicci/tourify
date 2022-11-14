import { useEffect, useState } from 'react';
import './FriendsTrips.css';
import { getFriendTrips } from '../../Utils/TripService';
import ExploreTripPreview from '../ExploreTripPreview/ExploreTripPreview';

function FriendsTrips() {
  const [friendTrips, setFriendTrips] = useState([]);

  useEffect(() => {
    const getTrips = async () => {
      const trips = await getFriendTrips();
      console.log(trips);
      setFriendTrips(trips);
    };
    getTrips();
  }, []);
  return (
    <div className="friends-trips">
      <div className="heading">
        <h1>Friends' Trips 🧳</h1>
      </div>
      <div className="friends-trips-container">
        {friendTrips.length ? (
          friendTrips.map((trip) => (
            <ExploreTripPreview key={trip._id} trip={trip} />
          ))
        ) : (
          <div className="no-friends-trips">
            <h1>You have no friends' trips</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsTrips;
