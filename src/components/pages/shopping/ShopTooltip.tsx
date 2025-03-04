interface ShopTooltipProps {
  shopName: string;
  shopDetails: string;
  visible: boolean;
  coordinates: [number, number];
  onClose?: () => void;
}

const ShopTooltip: React.FC<ShopTooltipProps> = ({
  shopName,
  visible,
  coordinates,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: coordinates[0],
        top: coordinates[1],
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
      onMouseLeave={onClose}
    >
      <h4>{shopName}</h4>
    </div>
  );
};

export default ShopTooltip;
