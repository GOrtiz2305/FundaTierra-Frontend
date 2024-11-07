import CodeDialog from "../../../../shared/CodeDialog";
import React from "react";
const DisabledSliderCode = () => {
    return (
        <>
            <CodeDialog>
                {`
import * as React from 'react';
import { Slider } from '@mui/material';

<Slider disabled defaultValue={30}  />
`}
            </CodeDialog>
        </>
    );
};

export default DisabledSliderCode;