export function generateApiEndpoints(serverIp: string) {
  if (process.env.NODE_ENV === "development") {
    return {
      stores: `http://${serverIp}/api/v1/plugins/EcoPriceCalculator/stores`,
      mapGif: `http://${serverIp}/Layers/TerrainLatest.gif`,
      mapInfo: `http://${serverIp}/api/v1/map/map.json`,
      allItems: `http://${serverIp}/api/v1/plugins/EcoPriceCalculator/allItems`,
    };
  }
  const proxyBase = "/api/proxy"; // Relative to your app's domain

  return {
    stores: `${proxyBase}?server=${serverIp}&path=api/v1/plugins/EcoPriceCalculator/stores`,
    mapGif: `${proxyBase}?server=${serverIp}&path=Layers/TerrainLatest.gif`,
    mapInfo: `${proxyBase}?server=${serverIp}&path=api/v1/map/map.json`,
    allItems: `${proxyBase}?server=${serverIp}&path=api/v1/plugins/EcoPriceCalculator/allItems`,
  };
}
