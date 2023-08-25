export const safeText = (node) =>
  node?.textContent
    ?.trim()
    ?.split("\n")
    .filter(Boolean)
    .join(" ");
export function _nodeElement(el) {
  return el as HTMLElement;
}
const classList = "hover:text-blue-400 hover:underline cursor-pointer hover:font-semibold text-select text-red-500".split(
  " "
);
export function handleItemClick(action) {
  document.addEventListener("keydown", function(e) {
    if (e.key === "Control") {
      document.querySelectorAll("a").forEach((e) => e.classList.add("hidden"));
      document.querySelectorAll("text").forEach((a) => {
        a.classList.add(...classList);
        a.addEventListener("click", action);
      });
    }
  });
  document.addEventListener("keyup", function(e) {
    if (e.key === "Control") {
      document
        .querySelectorAll("a")
        .forEach((e) => e.classList.remove("hidden"));
      document.querySelectorAll("text").forEach((element) => {
        element.classList.remove(...classList);
        element.removeEventListener("click", action);
      });
    }
  });
}
