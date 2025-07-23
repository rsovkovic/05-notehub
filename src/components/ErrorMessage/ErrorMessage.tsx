import css from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  return <p className={css.text}>Error loading notes. Please try again...</p>;
}
