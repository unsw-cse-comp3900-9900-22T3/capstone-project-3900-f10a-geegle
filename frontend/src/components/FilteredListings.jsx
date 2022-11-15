import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import PublishedCard from '../components/PublishedCard';

const FilteredListings = ({filteredListings}) => {
  console.log('filteredListing',filteredListings);
  return (
    <>
    {filteredListings.map((obj, idx) => {
      return (
        <PublishedCard eventObj ={obj} idx={idx} />
      )})
    }
    </>
  )
};
export default FilteredListings;