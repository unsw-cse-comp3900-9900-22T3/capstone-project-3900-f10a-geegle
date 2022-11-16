import PublishedCard from '../components/PublishedCard';

/**
 *  Component that renders the filtered listings on the public
 *  landing page
 */
const FilteredListings = ({filteredListings}) => {
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