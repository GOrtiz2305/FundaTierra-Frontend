import React from 'react';
import icon1 from 'src/assets/images/svgs/google-icon.svg';
import icon2 from 'src/assets/images/svgs/facebook-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Avatar, Box, Stack } from '@mui/material';
import useAuth from 'src/guards/authGuard/UseAuth';

const AuthSocialButtons = ({ title }) => {
  const { loginWithGoogle, loginWithFaceBook } = useAuth();

  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginFaceBook = async () => {
    try {
      await loginWithFaceBook();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        <CustomSocialButton onClick={handleLoginGoogle}>
          <Avatar
            src={icon1}
            alt={icon1}
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0,
              mr: 1,
            }}
          />
          <Box
            sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}
          >
            {title}
          </Box>{' '}
          Google
        </CustomSocialButton>
        <CustomSocialButton onClick={handleLoginFaceBook}>
          <Avatar
            src={icon2}
            alt={icon2}
            sx={{
              width: 25,
              height: 25,
              borderRadius: 0,
              mr: 1,
            }}
          />
          <Box
            sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}
          >
            {title}
          </Box>{' '}
          FB
        </CustomSocialButton>
      </Stack>
    </>
  );
};
export default AuthSocialButtons;
