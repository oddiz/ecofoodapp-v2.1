import dynamic from "next/dynamic";

const PieChart = dynamic(
  () => import("@nivo/pie").then((mod) => mod.ResponsivePie),
  {
    ssr: false,
    loading: () => <div></div>,
  },
);

export default PieChart;
