export default function getPosURL(pos: string) {
  return `https://restapi.amap.com/v3/staticmap?location=${pos}&zoom=10&size=750*300&markers=mid,,A:116.481485,39.990464&key=6fccbd888ac5f3c86e8393c8c7f10dc1`
}