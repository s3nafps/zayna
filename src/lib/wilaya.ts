export type WilayaLabelInput = {
  code: string;
  nameFr: string;
  nameAr: string;
};

// Wilaya label format from brief §5: "16 - Alger / الجزائر". Same in every UI language.
export function formatWilayaLabel(wilaya: WilayaLabelInput): string {
  return `${wilaya.code} - ${wilaya.nameFr} / ${wilaya.nameAr}`;
}
