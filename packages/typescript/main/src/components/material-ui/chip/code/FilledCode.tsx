import CodeDialog from "src/components/shared/CodeDialog";
const FilledCode = () => {
    return (
        <>
            <CodeDialog>
                {`

import * as React from 'react';
import { 
Avatar, 
Chip, 
Grid }  from '@mui/material';
import { 
IconCheck, 
IconChecks, 
IconMoodHappy } from '@tabler/icons-react';

import User1 from "src/assets/images/profile/user-1.jpg"
import User2 from "src/assets/images/profile/user-2.jpg"
import User3 from "src/assets/images/profile/user-3.jpg"

import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip avatar={<Avatar>M</Avatar>} label="Default Filled" />
    <Chip avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={User1} />} label="Primary Filled" color="primary" />
    <Chip avatar={<Avatar alt="Natacha" src={User1} />} label="Primary Deletable" color="primary" onDelete={handleDelete} />
    <Chip icon={<IconMoodHappy />} label="Secondary Filled" color="secondary" />
    <Chip icon={<IconMoodHappy />} label="Secondary Deletable" color="secondary" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={User2} />} label="Default Filled" color="success" />
    <Chip avatar={<Avatar alt="Natacha" src={User2} />} label="Default Deletable" color="success" onDelete={handleDelete} />
    <Chip icon={<IconMoodHappy />} label="Default Filled" color="warning" />
    <Chip icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={User3} />} label="Default Filled" color="error" />
    <Chip avatar={<Avatar alt="Natacha" src={User3} />} label="Default Deletable" color="error" onDelete={handleDelete} />
</InlineItemCard>`}
            </CodeDialog>
        </>
    );
};

export default FilledCode;