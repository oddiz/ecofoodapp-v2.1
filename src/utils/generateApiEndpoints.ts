export function generateApiEndpoints(serverIp: string) {
  if (process.env.NODE_ENV === "development") {
    // if server address is ip like 1.2.3.4:1234 use http, if domain name use https for in the return addresses
    if (serverIp.includes(":")) {
      return {
        stores: `http://${serverIp}/api/v1/plugins/EcoPriceCalculator/stores`,
        mapGif: `http://${serverIp}/Layers/WorldPreview.gif`,
        mapInfo: `http://${serverIp}/api/v1/map/map.json`,
        allItems: `http://${serverIp}/api/v1/plugins/EcoPriceCalculator/allItems`,
      };
    }
    return {
      stores: `https://${serverIp}/api/v1/plugins/EcoPriceCalculator/stores`,
      mapGif: `https://${serverIp}/Layers/WorldPreview.gif`,
      mapInfo: `https://${serverIp}/api/v1/map/map.json`,
      allItems: `https://${serverIp}/api/v1/plugins/EcoPriceCalculator/allItems`,
    };
  }
  const proxyBase = "/api/proxy"; // Relative to your app's domain

  return {
    stores: `${proxyBase}?server=${serverIp}&path=api/v1/plugins/EcoPriceCalculator/stores`,
    mapGif: `${proxyBase}?server=${serverIp}&path=Layers/WorldPreview.gif`,
    mapInfo: `${proxyBase}?server=${serverIp}&path=api/v1/map/map.json`,
    allItems: `${proxyBase}?server=${serverIp}&path=api/v1/plugins/EcoPriceCalculator/allItems`,
  };
}
