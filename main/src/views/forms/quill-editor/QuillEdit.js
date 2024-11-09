import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Quill.css';
import { Paper } from '@mui/material';

const QuillEdit = () => {
  const [text, setText] = useState('');

  return (
    <Paper variant="outlined">
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
