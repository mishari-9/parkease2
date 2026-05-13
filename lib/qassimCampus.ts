/** Qassim University — College of Computer (Buraydah), approximate campus anchor for map & copy. */
export const QASSIM_COLLEGE_OF_COMPUTER: { lat: number; lng: number; nameEn: string; nameAr: string } = {
  lat: 26.348867,
  lng: 43.743782,
  nameEn: "College of Computer & Information Sciences — Qassim University",
  nameAr: "كلية الحاسب ومعلومات — جامعة القصيم",
};

/** Small offset helpers (~110 m per 0.001° latitude at this latitude). */
export function offsetMeters(lat: number, lng: number, dNorthM: number, dEastM: number) {
  const latScale = 111_000;
  const lngScale = 88_500;
  return {
    lat: lat + dNorthM / latScale,
    lng: lng + dEastM / lngScale,
  };
}
