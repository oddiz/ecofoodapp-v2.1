export const NavItem = ({
    icon,
    active,
    onClickHandler,
    id,
    label,
}: {
    icon: JSX.Element;
    active: boolean;
    onClickHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    id: string;
    label: string;
}) => {
    return (
        <div
            id={id}
            className={`peer relative flex h-20 w-full cursor-pointer flex-col items-center justify-end overflow-hidden rounded-lg ${
                active
                    ? "border-b-[1px] border-b-primarydark-400 bg-primary-300 text-primary-100 dark:bg-primarydark-800"
                    : "text-primary-500 hover:bg-primary-300 hover:text-primary-150 dark:hover:bg-primarydark-650"
            }`}
            onClick={onClickHandler}
        >
            {active && ( // Glow effect
                <div className="absolute inset-0 left-1/2 h-full w-3/5 -translate-x-1/2 translate-y-10 scale-150 bg-gradient-radial from-primarydark-300/50 via-transparent " />
            )}
            {icon}
            <span className="mb-2 mt-2 font-[Cubano]  text-sm">{label}</span>
        </div>
    );
};
