import React, { FC, useState } from "react";
import DashboardHeader from "./DashBoardHeader";
import DashboardWidgets from "./Widgets/DashboardWidgets";


type Props = {
    isDashboard?: boolean;
};

const DashBoardHero: FC<Props> = ({ isDashboard }: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <DashboardHeader open={open} setOpen={setOpen} />
            {isDashboard && <DashboardWidgets open={open} />}
        </div>
    );
};

export default DashBoardHero;