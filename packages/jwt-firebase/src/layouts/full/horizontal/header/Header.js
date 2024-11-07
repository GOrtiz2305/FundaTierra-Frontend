import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar, setDarkMode } from 'src/store/customizer/CustomizerSlice';
import { IconMenu2 , IconMoon, IconSun} from '@tabler/icons';
import Notifications from 'src/layouts/full/vertical/header/Notification';
import Profile from 'src/layouts/full/vertical/header/Profile';
import Search from 'src/layouts/full/vertical/header/Search';
import Language from 'src/layouts/full/vertical/header/Language';
import Logo from 'src/layouts/full/shared/logo/Logo';

const Header = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',

    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(() => ({ margin: '0 auto', width: '100%' }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
        }}
      >
        <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
          <Logo />
        </Box>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        {lgDown ? (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleMobileSidebar())}
          >
            <IconMenu2 />
          </IconButton>
        ) : (
          ''
        )}
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <Search />
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Language />
          <IconButton size="large" color="inherit">
            {customizer.activeMode === "light" ? (
              <IconMoon
                size="21"
                stroke="1.5"
                onClick={() => dispatch(setDarkMode("dark"))}
              />
            ) : (
              <IconSun
                size="21"
                stroke="1.5"
                onClick={() => dispatch(setDarkMode("light"))}
              />
            )}
          </IconButton>

          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          <Notifications />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
