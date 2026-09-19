export type MaterialType = "Rubber Scrap" | "PET Plastic" | "Textile Scrap" | "Aluminum Scrap";
export type Grade = "A" | "B" | "C";

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  grade: Grade;
  condition: string;
  location: string;
  pricePerKg: number; // IDR, listed price
  floorPrice: number; // IDR, lowest price the mock supplier will accept (never shown)
  quantityKg: number;
  minOrderKg: number;
  description: string;
  specs: [string, string][];
  supplier: { name: string; city: string; verified: boolean; since: number };
}

export const MATERIAL_TYPES: MaterialType[] = ["Rubber Scrap", "PET Plastic", "Textile Scrap", "Aluminum Scrap"];
export const GRADES: Grade[] = ["A", "B", "C"];
export const CONDITIONS = ["Baled", "Clean", "Shredded", "Sorted", "Mixed"];
export const LOCATIONS = ["Bekasi", "Bandung", "Semarang", "Surabaya", "Palembang", "Cikarang", "Medan"];

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const formatKg = (n: number) => `${new Intl.NumberFormat("id-ID").format(n)} kg`;

export const materials: Material[] = [
  {
    id: "rubber-tire-crumb-palembang", name: "Tire Rubber Crumb (SBR)", type: "Rubber Scrap", grade: "A", condition: "Shredded",
    location: "Palembang", pricePerKg: 3800, floorPrice: 3300, quantityKg: 40000, minOrderKg: 2000,
    description: "Ground rubber from passenger-car tires, steel and fiber removed. Suitable for rubberized asphalt, sports flooring, and molded products.",
    specs: [["Mesh size", "10–30 mesh"], ["Steel content", "< 0.05%"], ["Moisture", "< 1%"], ["Packaging", "1-ton jumbo bags"], ["Source", "Post-consumer tires"]],
    supplier: { name: "PT Karet Nusantara Lestari", city: "Palembang", verified: true, since: 2018 },
  },
  {
    id: "rubber-offcut-sheet-bekasi", name: "EPDM Rubber Offcuts", type: "Rubber Scrap", grade: "B", condition: "Sorted",
    location: "Bekasi", pricePerKg: 2600, floorPrice: 2200, quantityKg: 12000, minOrderKg: 1000,
    description: "Clean production offcuts from automotive seal manufacturing. Single compound, no contamination.",
    specs: [["Compound", "EPDM 65 Shore A"], ["Form", "Strips and trimmings"], ["Contamination", "None"], ["Packaging", "Palletized bags"], ["Source", "Industrial offcuts"]],
    supplier: { name: "PT Seal Karya Otomotif", city: "Bekasi", verified: true, since: 2020 },
  },
  {
    id: "pet-bottle-flakes-bekasi", name: "PET Bottle Flakes, Clear", type: "PET Plastic", grade: "A", condition: "Clean",
    location: "Bekasi", pricePerKg: 9500, floorPrice: 8400, quantityKg: 25000, minOrderKg: 1000,
    description: "Hot-washed clear PET flakes from post-consumer bottles. Suitable for fiber and sheet extrusion.",
    specs: [["Flake size", "8–12 mm"], ["Color", "Clear > 95%"], ["PVC content", "< 50 ppm"], ["Moisture", "< 1%"], ["Packaging", "600 kg jumbo bags"]],
    supplier: { name: "PT Plastindo Daur Makmur", city: "Bekasi", verified: true, since: 2016 },
  },
  {
    id: "pet-bottle-bale-surabaya", name: "PET Bottle Bales, Mixed Color", type: "PET Plastic", grade: "C", condition: "Baled",
    location: "Surabaya", pricePerKg: 5200, floorPrice: 4500, quantityKg: 60000, minOrderKg: 5000,
    description: "Compressed post-consumer PET bottle bales, caps and labels included. Requires further sorting and washing.",
    specs: [["Bale weight", "≈ 350 kg"], ["Color mix", "Clear, blue, green"], ["Caps and labels", "Included"], ["Contamination", "< 8%"], ["Source", "Waste bank collection"]],
    supplier: { name: "CV Bank Sampah Jatim Bersih", city: "Surabaya", verified: false, since: 2021 },
  },
  {
    id: "textile-cotton-offcut-bandung", name: "Cotton Fabric Offcuts, White", type: "Textile Scrap", grade: "A", condition: "Sorted",
    location: "Bandung", pricePerKg: 6800, floorPrice: 5900, quantityKg: 8000, minOrderKg: 500,
    description: "Pre-consumer white cotton cutting waste from garment production. Suitable for wiping cloth, recycled yarn, and nonwoven felt.",
    specs: [["Fiber", "100% cotton"], ["Color", "White, undyed"], ["Piece size", "> 20 cm"], ["Packaging", "50 kg bales"], ["Source", "Garment cutting room"]],
    supplier: { name: "CV Tekstil Sinar Jaya", city: "Bandung", verified: true, since: 2019 },
  },
  {
    id: "textile-mixed-rags-semarang", name: "Mixed Textile Waste (Polyester Blend)", type: "Textile Scrap", grade: "C", condition: "Mixed",
    location: "Semarang", pricePerKg: 2100, floorPrice: 1700, quantityKg: 30000, minOrderKg: 2000,
    description: "Mixed-color polyester blend scraps from spinning and weaving. Suitable for stuffing, insulation, and shredded fiber.",
    specs: [["Fiber", "Polyester / cotton blend"], ["Color", "Mixed"], ["Moisture", "< 10%"], ["Packaging", "Loose bales, 80 kg"], ["Source", "Weaving mill waste"]],
    supplier: { name: "PT Tenun Jateng Makmur", city: "Semarang", verified: true, since: 2017 },
  },
  {
    id: "aluminum-extrusion-cikarang", name: "Aluminum Extrusion Scrap 6063", type: "Aluminum Scrap", grade: "A", condition: "Clean",
    location: "Cikarang", pricePerKg: 21500, floorPrice: 19200, quantityKg: 15000, minOrderKg: 1000,
    description: "Clean 6063 window-frame and profile offcuts, no paint or coating. Ready for remelting.",
    specs: [["Alloy", "6063"], ["Purity", "> 98%"], ["Coating", "None (mill finish)"], ["Form", "Cut profiles, < 1 m"], ["Packaging", "Steel pallets"]],
    supplier: { name: "PT Alumunium Sentosa Recycling", city: "Cikarang", verified: true, since: 2015 },
  },
  {
    id: "aluminum-can-bale-medan", name: "Aluminum Used Beverage Can Bales", type: "Aluminum Scrap", grade: "B", condition: "Baled",
    location: "Medan", pricePerKg: 17800, floorPrice: 15800, quantityKg: 22000, minOrderKg: 2000,
    description: "Compressed UBC bales collected from Sumatra waste banks. Low contamination, ready for remelting.",
    specs: [["Alloy", "3004 / 5182 (UBC)"], ["Bale density", "≈ 350 kg/m³"], ["Contamination", "< 3%"], ["Moisture", "< 2%"], ["Source", "Post-consumer cans"]],
    supplier: { name: "CV Logam Daur Sumatera", city: "Medan", verified: false, since: 2022 },
  },
];

export const getMaterial = (id: string) => materials.find((m) => m.id === id);
