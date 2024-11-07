import { Card } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';


const BlankCard = ({ children, className, sx }) => {
  const customizer = useSelector((state) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.grey[100];

  return (
    <Card
      sx={{ p: 0, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' , position: 'relative', sx }}
      className={className}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      {children}
    </Card>
  );
};

export default BlankCard;
