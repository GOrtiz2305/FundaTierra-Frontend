import CodeDialog from "../../../../shared/CodeDialog";
import React from "react";
const ColorsSwitchCode = () => {
    return (
        <>
            <CodeDialog>
                {`
import * as React from 'react';
import { Box, Switch } from '@mui/material';

<Box textAlign="center">
    <Switch defaultChecked />
    <Switch defaultChecked color="secondary" />
    <Switch defaultChecked color="error" />
    <Switch defaultChecked color="warning" />
    <Switch defaultChecked color="success" />
    <Switch defaultChecked color="default" />
</Box>
`}
            </CodeDialog>
        </>
    );
};

export default ColorsSwitchCode;