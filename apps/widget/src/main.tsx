import { createRoot } from "react-dom/client";
import "./widget.css";
import CTAWidget from "./CTAWidget";
import ListingsWidget from "./ListingsWidget";
import ProgramWidget from "./ProgramWidget";

document.querySelectorAll<HTMLElement>(".asd-cta-widget").forEach((el) => {
  if (el.dataset.buttonColor) {
    el.style.setProperty("--color-primary", el.dataset.buttonColor);
  }
  createRoot(el).render(<CTAWidget dataset={el.dataset} />);
});

document.querySelectorAll<HTMLElement>(".asd-listings-widget").forEach((el) => {
  if (el.dataset.buttonColor) {
    el.style.setProperty("--color-primary", el.dataset.buttonColor);
  }
  createRoot(el).render(<ListingsWidget dataset={el.dataset} />);
});

document.querySelectorAll<HTMLElement>(".asd-program-widget").forEach((el) => {
  createRoot(el).render(<ProgramWidget dataset={el.dataset} />);
});
