import { Food } from "@/types/food";
import { ResponsivePie } from "@nivo/pie";
import { animated } from "@react-spring/web";

export const PieChartFromFood = ({
    food,
    labels,
    interactive,
}: {
    food: Food;
    labels: boolean;
    interactive: boolean;
}) => {
    const data = [
        { id: "carbs", label: "Carbs", value: food.carb, color: "#dc4817" },
        { id: "proteins", label: "Protein", value: food.pro, color: "#c88911" },
        { id: "fat", label: "Fat", value: food.fat, color: "#ffd21c" },
        { id: "vitamin", label: "Vitamin", value: food.vit, color: "#7a9818" },
    ];

    const totalNutrients = food.carb + food.fat + food.pro + food.vit;
    const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
        return (
            <g className="h-96 w-96 bg-white">
                {labels && (
                    <text
                        x={centerX - 0.5}
                        y={centerY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className=" font-base  "
                        fill="#fff"
                    >
                        {totalNutrients}
                    </text>
                )}
            </g>
        );
    };

    return (
        <ResponsivePie
            data={data}
            layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
            innerRadius={labels ? 0.3 : 0}
            padAngle={0.7}
            cornerRadius={0}
            isInteractive={interactive}
            activeOuterRadiusOffset={8}
            borderWidth={0}
            borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
            }}
            enableArcLabels={labels}
            arcLabelsRadiusOffset={0.55}
            arcLabelsSkipAngle={30}
            enableArcLinkLabels={false}
            arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
            }}
            motionConfig="stiff"
            arcLabelsComponent={({ datum, label, style }) => (
                <animated.g
                    transform={style.transform}
                    style={{ pointerEvents: "none" }}
                >
                    <circle
                        fill={style.textColor}
                        cy={6}
                        r={9}
                    />
                    <circle
                        fill="#ffffff"
                        stroke={datum.color}
                        strokeWidth={2}
                        r={10}
                    />
                    <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={style.textColor}
                        style={{
                            fontSize: 8,
                            fontWeight: 800,
                        }}
                    >
                        {label}
                    </text>
                </animated.g>
            )}
            defs={[
                {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.103)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.096)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            tooltip={ChartTooltip}
            colors={{ datum: "data.color" }}
            fill={[
                {
                    match: {
                        id: "carbs",
                    },
                    id: "dots",
                },
                {
                    match: {
                        id: "proteins",
                    },
                    id: "lines",
                },
                {
                    match: {
                        id: "fat",
                    },
                    id: "dots",
                },
                {
                    match: {
                        id: "vitamin",
                    },
                    id: "lines",
                },
            ]}
        />
    );
};

const ChartTooltip = ({ datum: { label, value, color } }: any) => {
    return (
        <div
            style={{
                padding: 6,
                color,
                background: "#222230",
                borderRadius: 10,
                zIndex: 100,
                overflow: "visible",
            }}
        >
            <strong>
                {label}: {value}
            </strong>
        </div>
    );
};
