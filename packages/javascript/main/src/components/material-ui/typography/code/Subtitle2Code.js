import CodeDialog from "../../../shared/CodeDialog";
import React from "react";
const Subtitle2Code = () => {
    return (
        <>
            <CodeDialog>
                {`

import { Typography } from '@mui/material';

<Typography variant="subtitle2">
    subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
    tenetur
</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Subtitle2Code;