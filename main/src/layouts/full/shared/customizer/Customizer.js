import { useState } from 'react';
import {
  Fab,
  Drawer,
  Grid,
  Divider,
  styled,
  Typography,
  Slider,
  Tooltip,
  IconButton,
  Stack,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { IconX, IconSettings, IconCheck } from '@tabler/icons';
import {
  setTheme,
  setDir,
  setDarkMode,
  toggleLayout,
  toggleSidebar,
  toggleHorizontal,
  setBorderRadius,
  setCardShadow,
} from 'src/store/customizer/CustomizerSlice';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import SwipeLeftAltTwoToneIcon from '@mui/icons-material/SwipeLeftAltTwoTone';
import SwipeRightAltTwoToneIcon from '@mui/icons-material/SwipeRightAltTwoTone';
import AspectRatioTwoToneIcon from '@mui/icons-material/AspectRatioTwoTone';
import CallToActionTwoToneIcon from '@mui/icons-material/CallToActionTwoTone';
import ViewSidebarTwoToneIcon from '@mui/icons-material/ViewSidebarTwoTone';
import WebAssetTwoToneIcon from '@mui/icons-material/WebAssetTwoTone';
import { ViewComfyTwoTone, PaddingTwoTone, BorderOuter } from '@mui/icons-material';

const SidebarWidth = '320px';

const Customizer = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useSelector((state) => state.customizer);

  const dispatch = useDispatch();

  const StyledBox = styled(Box)(({ theme }) => ({
    boxShadow: theme.shadows[8],
    padding: '20px',
    cursor: 'pointer',
    justifyContent: 'center',
    display: 'flex',
    transition: '0.1s ease-in',
    border: '1px solid rgba(145, 158, 171, 0.12)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));

  const thColors = [
    {
      id: 1,
      bgColor: '#5D87FF',
      disp: 'BLUE_THEME',
    },
    {
      id: 2,
      bgColor: '#0074BA',
      disp: 'AQUA_THEME',
    },
    {
      id: 3,
      bgColor: '#763EBD',
      disp: 'PURPLE_THEME',
    },
    {
      id: 4,
      bgColor: '#0A7EA4',
      disp: 'GREEN_THEME',
    },
    {
      id: 5,
      bgColor: '#01C0C8',
      disp: 'CYAN_THEME',
    },
    {
      id: 6,
      bgColor: '#FA896B',
      disp: 'ORANGE_THEME',
    },
  ];

  return (
    <div>
      {/* ------------------------------------------- */}
      {/* --Floating Button to open customizer ------ */}
      {/* ------------------------------------------- */}
      <Tooltip title="Settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ position: 'fixed', right: '25px', bottom: '15px' }}
          onClick={() => setShowDrawer(true)}
        >
          <IconSettings stroke={1.5} />
        </Fab>
      </Tooltip>
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        {/* ------------------------------------------- */}
        {/* ------------ Customizer Sidebar ------------- */}
        {/* ------------------------------------------- */}
        <Scrollbar sx={{ height: 'calc(100vh - 5px)' }}>
          <Box p={2} display="flex" justifyContent={'space-between'} alignItems="center">
            <Typography variant="h4">Settings</Typography>
            <IconButton color="inherit" onClick={() => setShowDrawer(false)}>
              <IconX size="1rem" />
            </IconButton>
          </Box>
          <Divider />
          <Box p={3}>
            {/* ------------------------------------------- */}
            {/* ------------ Dark light theme setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Theme Option
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setDarkMode('light'))} display="flex" gap={1}>
                <WbSunnyTwoToneIcon
                  color={customizer.activeMode === 'light' ? 'primary' : 'inherit'}
                />
                Light
              </StyledBox>
              <StyledBox onClick={() => dispatch(setDarkMode('dark'))} display="flex" gap={1}>
                <DarkModeTwoToneIcon
                  color={customizer.activeMode === 'dark' ? 'primary' : 'inherit'}
                />
                Dark
              </StyledBox>
            </Stack>

            <Box pt={3} />
            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" mb={1} gutterBottom>
              Theme Colors
            </Typography>
            <Grid container spacing={2}>
              {thColors.map((thcolor) => (
                <Grid item xs={4} key={thcolor.id}>
                  <StyledBox onClick={() => dispatch(setTheme(thcolor.disp))}>
                    <Tooltip title={thcolor.disp} placement="top">
                      <Box
                        sx={{
                          backgroundColor: thcolor.bgColor,
                          width: '25px',
                          height: '25px',
                          borderRadius: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          display: 'flex',
                          color: 'white',
                        }}
                        aria-label={thcolor.bgcolor}
                      >
                        {customizer.activeTheme === thcolor.disp ? <IconCheck width={13} /> : ''}
                      </Box>
                    </Tooltip>
                  </StyledBox>
                </Grid>
              ))}
            </Grid>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Layout Boxed / Full ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Container Option
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(toggleLayout('boxed'))} display="flex" gap={1}>
                <CallToActionTwoToneIcon
                  color={customizer.isLayout === 'boxed' ? 'primary' : 'inherit'}
                />
                Boxed
              </StyledBox>
              <StyledBox onClick={() => dispatch(toggleLayout('full'))} display="flex" gap={1}>
                <AspectRatioTwoToneIcon
                  color={customizer.isLayout === 'full' ? 'primary' : 'inherit'}
                />
                Full
              </StyledBox>
            </Stack>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Sidebar Color setting ------------- */}
            {/* ------------------------------------------- */}

            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
          </Box>
        </Scrollbar>
      </Drawer>
    </div>
  );
};

export default Customizer;
