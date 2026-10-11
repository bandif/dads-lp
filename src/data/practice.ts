import details from "../content/site/practice.json";

export const practice = {
  ...details,
  profilePath: "/dr-fekete-ferenc/",
  phoneHref: `tel:${details.phone.replace(/[^+\d]/g, "")}`,
  mapUrl: `https://maps.google.com/?q=${encodeURIComponent(details.address)}`,
};
