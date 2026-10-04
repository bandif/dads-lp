type MedicalContent = {
  updated: string;
  // Set only after Dr. Fekete has actually reviewed this version of the text.
  reviewedOn?: string;
  sources: { name: string; url: string }[];
};

export const medicalContent: Record<string, MedicalContent> = {
  "/fitymaszukulet/": {
    updated: "2026-10-04",
    sources: [
      { name: "BAUS: fitymaszűkület", url: "https://www.baus.org.uk/patients/conditions/13/tight_foreskin_phimosis/" },
      { name: "NHS: körülmetélés és felépülés", url: "https://www.nhs.uk/tests-and-treatments/circumcision/" },
      { name: "BAUS: fékplasztika", url: "https://www.baus.org.uk/_userfiles/pages/files/Patients/Leaflets/Frenuloplasty.pdf" },
    ],
  },
  "/papulak/": {
    updated: "2026-10-04",
    sources: [{ name: "DermNet: gyöngyházfényű papulák", url: "https://dermnetnz.org/topics/pearly-penile-papules" }],
  },
  "/peniszgorbulet/": {
    updated: "2026-10-04",
    sources: [{ name: "NHS: Peyronie-betegség", url: "https://www.nhs.uk/conditions/peyronies-disease/" }],
  },
};
