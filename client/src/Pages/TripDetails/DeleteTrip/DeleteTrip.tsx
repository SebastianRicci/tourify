import './DeleteTrip.css';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { MutableRefObject, useRef } from 'react';
import { deleteTrip } from '../../../Utils/TripService';
import { useNavigate } from 'react-router-dom';
import { DeleteTripProps } from '../../../../types/props';

function DeleteTrip({ tripId, renderToast, onExport }: DeleteTripProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as MutableRefObject<HTMLButtonElement>;
  const navigate = useNavigate();
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]

  const handleTripDelete = async () => {
    const res = await deleteTrip(tripId);
    if (res.acknowledged) {
      renderToast('Success', 'success', 'Trip deleted successfully');
      navigate('/dashboard');
    }
    onClose();
  };

  return (
    <>
      <div className="delete">
        <Button colorScheme="blue" onClick={onExport}>Export to Google Calendar</Button>
        <Button colorScheme="red" onClick={onOpen}>Delete Trip</Button>
      </div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Trip
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleTripDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteTrip;
