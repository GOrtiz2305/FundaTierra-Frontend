// material
import { TextField, InputAdornment } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';

// redux
import { useDispatch } from 'src/store/Store';
import { SearchProduct } from 'src/store/apps/eCommerce/ECommerceSlice';

// ----------------------------------------------------------------------
export default function ProductSearch() {
  const dispatch = useDispatch();

  return (
    <>
      {/* ------------------------------------------- */}
      {/* Sort Button */}
      {/* ------------------------------------------- */}
      <TextField
        id="outlined-search"
        placeholder="Search Product"
        size="small"
        type="search"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size="14" />
            </InputAdornment>
          ),
        }}
        fullWidth
        onChange={(e) => dispatch(SearchProduct(e.target.value))}
      />
    </>
  );
}
