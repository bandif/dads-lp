import phimosis from "../content/site/fitymaszukulet.json";
import papules from "../content/site/papulak.json";
import curvature from "../content/site/peniszgorbulet.json";

type MedicalContent = {
  updated: string;
  // Set only after Dr. Fekete has actually reviewed this version of the text.
  reviewedOn?: string;
  sources: { name: string; url: string }[];
};

export const medicalContent: Record<string, MedicalContent> = {
  "/fitymaszukulet/": phimosis.editorial,
  "/papulak/": papules.editorial,
  "/peniszgorbulet/": curvature.editorial,
};
