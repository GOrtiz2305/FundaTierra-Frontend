import CodeDialog from "../../../shared/CodeDialog";
import React from "react";
const IconAvatarsCode = () => {
    return (
        <>
            <CodeDialog>
                {`
import * as React from 'react';
import { Avatar, Stack } from '@mui/material';
import { IconMoodSmile } from '@tabler/icons';

<Stack direction="row" spacing={1} justifyContent="center">
    <Avatar sx={{ bgcolor: 'primary.main' }}>
        <IconMoodSmile width={24} />
    </Avatar>
    <Avatar sx={{ bgcolor: 'secondary.main' }}>
        <IconMoodSmile width={24} />
    </Avatar>
    <Avatar sx={{ bgcolor: 'error.main' }}>
        <IconMoodSmile width={24} />
    </Avatar>
    <Avatar sx={{ bgcolor: 'warning.main' }}>
        <IconMoodSmile width={24} />
    </Avatar>
    <Avatar sx={{ bgcolor: 'success.main' }}>
        <IconMoodSmile width={24} />
    </Avatar>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default IconAvatarsCode;