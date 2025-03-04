import React, { useState } from "react";

interface Food {
  carb: number;
  pro: number;
  fat: number;
  vit: number;
}

interface CustomPieChartProps {
  food: Food;
  labels: boolean;
  interactive: boolean;
  size?: number;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  food,
  labels,
  interactive,
  size = 200,
}) => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const data = [
    { id: "carbs", label: "Carbs", value: food.carb, color: "#dc4817" },
    { id: "proteins", label: "Protein", value: food.pro, color: "#c88911" },
    { id: "fat", label: "Fat", value: food.fat, color: "#ffd21c" },
    { id: "vitamin", label: "Vitamin", value: food.vit, color: "#7a9818" },
  ];

  const totalNutrients = food.carb + food.fat + food.pro + food.vit;

  // Filter out zero values to prevent empty segments
  const filteredData = data.filter((item) => item.value > 0);

  // Calculate segments
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const innerRadius = labels ? radius * 0.3 : 0;
  const segments: Array<{
    path: string;
    color: string;
    id: string;
    label: string;
    value: number;
    labelX: number;
    labelY: number;
  }> = [];

  let startAngle = 0;
  filteredData.forEach((item) => {
    const segmentAngle = (item.value / totalNutrients) * 2 * Math.PI;
    const endAngle = startAngle + segmentAngle;

    // Calculate SVG arc path
    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(startAngle);
    const y2 = centerY + radius * Math.sin(startAngle);
    const x3 = centerX + radius * Math.cos(endAngle);
    const y3 = centerY + radius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);

    // Use outer arc flag to correctly draw segments
    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
    `;

    // Calculate label position
    const labelAngle = startAngle + segmentAngle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);

    segments.push({
      path,
      color: item.color,
      id: item.id,
      label: item.label,
      value: item.value,
      labelX,
      labelY,
    });

    startAngle = endAngle;
  });

  const handleMouseMove = (event: React.MouseEvent, id: string) => {
    if (!interactive) return;
    setActiveSegment(id);
    setTooltipPos({ x: event.detail.valueOf(), y: event.detail.valueOf() });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setActiveSegment(null);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {segments.map((segment, index) => {
          const patternFill =
            segment.id === "carbs" || segment.id === "fat"
              ? "url(#dots)"
              : "url(#lines)";

          return (
            <g key={segment.id}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="#222230"
                strokeWidth="0"
                onMouseMove={(e) => handleMouseMove(e, segment.id)}
                onMouseLeave={handleMouseLeave}
                style={{
                  transition: "transform 0.2s ease",
                  transform:
                    activeSegment === segment.id
                      ? `translate(${Math.cos(startAngle + (index * Math.PI) / 2) * 5}px, ${Math.sin(startAngle + (index * Math.PI) / 2) * 5}px)`
                      : "",
                  cursor: interactive ? "pointer" : "default",
                }}
              />
              <path
                d={segment.path}
                fill={patternFill}
                onMouseMove={(e) => handleMouseMove(e, segment.id)}
                onMouseLeave={handleMouseLeave}
                style={{ pointerEvents: "none" }}
              />
              {labels && (
                <g
                  transform={`translate(${segment.labelX - 10}, ${segment.labelY - 10})`}
                  style={{ pointerEvents: "none" }}
                >
                  <circle
                    r="10"
                    fill="#ffffff"
                    stroke={segment.color}
                    strokeWidth="2"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#222230"
                    style={{ fontSize: 8, fontWeight: 800 }}
                  >
                    {segment.label.charAt(0)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Center text */}
        {labels && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-base"
            fill="#fff"
            fontSize="14"
          >
            {totalNutrients}
          </text>
        )}
      </svg>

      {/* Tooltip */}
      {interactive && activeSegment && (
        <div
          className="absolute z-50 px-3 py-2 rounded-md shadow-lg"
          style={{
            top: tooltipPos.y - 60,
            left: tooltipPos.x - 50,
            background: "#222230",
            borderRadius: "10px",
            pointerEvents: "none",
            color: data.find((d) => d.id === activeSegment)?.color ?? "#fff",
          }}
        >
          <strong>
            {data.find((d) => d.id === activeSegment)?.label}:{" "}
            {data.find((d) => d.id === activeSegment)?.value}
          </strong>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
