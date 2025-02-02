import './SuggestedResult.css';
import { useState, useEffect } from 'react';
import { MdReviews } from 'react-icons/md';
import { formatDate } from '../../../../../Utils/date';
import { v4 as uuidv4 } from 'uuid';
import {
  AiFillStar,
  AiOutlineHeart,
  AiFillHeart,
  AiFillCaretDown
} from 'react-icons/ai';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Tooltip,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast
} from '@chakra-ui/react';
import { SuggestedResultProps } from '../../../../../../types/props';
import { Itinerary } from '../../../../../../types/models';

function SuggestedResult({ place, itinerary, setItinerary, isAuth }: SuggestedResultProps) {
  const [placeUrl, setPlaceUrl] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [activeDay, setActiveDay] = useState(itinerary[0].date);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [placeId, setPlaceId] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: place.place_id || '',
      fields: ['url']
    };

    // eslint-disable-next-line no-undef
    const location = new google.maps.LatLng(0, 0);

    // eslint-disable-next-line no-undef
    let map;
    const mapDiv = document.getElementById('places-map-div');
    if (mapDiv) map = new google.maps.Map(mapDiv, {
      center: location,
      zoom: 15
    });

    // eslint-disable-next-line no-undef
    let detailsService;
    if (map) detailsService = new google.maps.places.PlacesService(map);

    const callback: (a: google.maps.places.PlaceResult | null, b: google.maps.places.PlacesServiceStatus) => void = (placeRes, status) => {
      if (status === 'OK') {
        if (placeRes && placeRes.url) setPlaceUrl(placeRes.url);
      }
    }
    if (detailsService) detailsService.getDetails(request, callback);


    for (let i = 0; i < itinerary.length; i++) {
      for (let j = 0; j < itinerary[i].places.length; j++) {
        if (itinerary[i].places[j].place === place.name) {
          setPlaceId(itinerary[i].places[j].id);
          setIsAdded(true);
        }
      }
    }
  }, [place, itinerary]);

  if (placeUrl === '' || !place.photos || !place.rating) return <></>;

  const handlePlaceAdd = () => {
    if (place.name) {
      const newPlace = {
        place: place.name,
        id: uuidv4()
      };
      setItinerary((prev) => {
        const newItinerary: Itinerary[] = [];
        for (let i = 0; i < prev.length; i++) {
          if (i === activeDayIndex && newPlace) {
            newItinerary.push({
              ...prev[i],
              places: [...prev[i].places, newPlace]
            });
          } else {
            newItinerary.push(prev[i]);
          }
        }
        return newItinerary;
      });
    }
    toast({
      position: 'bottom-left',
      title: 'Success',
      description: 'Itinerary updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    setIsAdded(true);
  };

  const handlePlaceRemove = () => {
    setItinerary((prev) => {
      const newItinerary = [];
      for (let i = 0; i < prev.length; i++) {
        newItinerary.push({
          ...prev[i],
          places: prev[i].places.filter((p) => p.id !== placeId)
        });
      }
      return newItinerary;
    });
    setIsAdded(false);
  };

  const handleDayChange = (day: Itinerary, index: number) => {
    setActiveDay(day.date);
    setActiveDayIndex(index);
  };

  return (
    <div className="suggested-result">
      <img src={place.photos[0].getUrl()} alt="" className="place-img" />
      <div className="details">
        <div className="reviews">
          <div className="left">
            <AiFillStar size="0.75em" />
            <p>{place.rating}</p>
          </div>
          <div className="right">
            <MdReviews size="0.75em" />
            <p>{Number(place.user_ratings_total).toLocaleString()}</p>
          </div>
        </div>
        <h1>{place.name}</h1>
        {isAuth ? (
          <div className="actions">
            {isAdded ? (
              <Tooltip
                label="Remove from itinerary"
                hasArrow
                arrowSize={10}
                placement="right"
              >
                <span>
                  <AiFillHeart
                    className="add-icon"
                    onClick={handlePlaceRemove}
                    color="red"
                  />
                </span>
              </Tooltip>
            ) : (
              <Popover>
                <PopoverTrigger>
                  <button>
                    <AiOutlineHeart className="add-icon" color="red" />
                  </button>
                </PopoverTrigger>
                <PopoverContent border="0">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Select a day in your itinerary</PopoverHeader>
                  <PopoverBody className="popover-body">
                    <Menu>
                      <MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
                        {formatDate(activeDay)}
                      </MenuButton>
                      <MenuList>
                        {itinerary.map((day, index) => (
                          <MenuItem
                            key={day.date}
                            onClick={() => handleDayChange(day, index)}
                          >
                            {formatDate(day.date)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                    <Button onClick={handlePlaceAdd}>Add Place</Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
            <Tooltip
              label="View place in google maps"
              hasArrow
              arrowSize={10}
              placement="right"
            >
              <a href={placeUrl} target="_blank" rel="noreferrer">
                <button className="google-map"></button>
              </a>
            </Tooltip>
          </div>
        ) : (
          <div className="actions">
            <Tooltip
              label="View place in google maps"
              hasArrow
              arrowSize={10}
              placement="right"
            >
              <a href={placeUrl} target="_blank" rel="noreferrer">
                <button className="google-map"></button>
              </a>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestedResult;
