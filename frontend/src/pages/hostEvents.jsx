import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const HostEventsPage = () => {
    // const [myListings, setMyListings] = React.useState([]);

  //     // upon entering the page
  // React.useEffect(async () => {
  //   // fetch bookings if token is available
  //   if (localStorage.getItem('token')) {
  //     const response = await fetch(`http://localhost:3000/host/${localStorage.getItem('token')}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + localStorage.getItem('token'),
  //       },
  //     });
  //     const json = await response.json();
  //     for (const listing of json.bookings) {
  //       if (listing.owner === localStorage.getItem('email')) {
  //         addBookingListing(parseInt(listing.listingId));
  //       }
  //     }
  //   }

  //   // fetch all listing
  //   const response = await fetch('http://localhost:5005/listings');
  //   const json = await response.json();
  //   const publishArrayLocal = [];
  //   let averageLocal = 0;
  //   let ratioLocal = 0;
  //   for (const listing of json.listings) {
  //     const response = await fetch(
  //       `http://localhost:5005/listings/${listing.id}`
  //     );
  //     const json = await response.json();
  //     if (json.listing.published) {
  //       if (json.listing.reviews.length === 0) {
  //         ratioLocal = 0;
  //         averageLocal = 0;
  //       } else {
  //         const sum = json.listing.reviews.reduce((a, b) => ({
  //           rating: a.rating + b.rating,
  //         })).rating;

  //         averageLocal = sum / json.listing.reviews.length;
  //         ratioLocal = sum / (json.listing.reviews.length * 5);
  //       }

  //       // only want the published listings
  //       publishArrayLocal.push({
  //         listing: {
  //           id: listing.id,
  //           title: json.listing.title,
  //           owner: json.listing.owner,
  //           address: json.listing.address,
  //           price: json.listing.price,
  //           thumbnail: json.listing.thumbnail,
  //           metadata: json.listing.metadata,
  //           reviews: json.listing.reviews,
  //           availability: json.listing.availability,
  //           published: json.listing.published,
  //           postedOn: json.listing.postedOn,
  //           ratingRatio: ratioLocal,
  //           averageRating: averageLocal,
  //         },
  //       });
  //     }
  //   }

  //   // sort alphabetical order
  //   publishArrayLocal.sort((a, b) => {
  //     const aName = a.listing.title.toUpperCase();
  //     const bName = b.listing.title.toUpperCase();
  //     return aName < bName ? -1 : aName > bName ? 1 : 0;
  //   });
  //   setPublishArray(publishArrayLocal);
  // }, []);
  
  return (
    <>  
    <div>
      Your Events
    </div>
      {/* <Card sx={{ maxWidth: 345 }}>
        <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
        </CardActions>
      </Card> */}
    </>
  );
};
export default HostEventsPage;