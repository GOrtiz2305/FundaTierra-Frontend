// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useTheme } from '@mui/material/styles';
import 'react-quill/dist/quill.snow.css';
import './Quill.css';
import { Paper } from '@mui/material';

const QuillEdit = () => {
  const [text, setText] = useState('');

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Paper sx={{ border: `1px solid ${borderColor}` }} variant="outlined">
      <ReactQuill
        value={text}
        onChange={(value) => {
          setText(value);
        }}
        placeholder="Type here..."
      />
    </Paper>
  );
};

export default QuillEdit;
