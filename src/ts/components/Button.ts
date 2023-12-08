export const setButtonStyle = (button: HTMLButtonElement, backgroundColor: string) => {
  button.style.position = "fixed";
  button.style.top = "50%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.color = "#fff";
  button.style.backgroundColor = backgroundColor;
  button.style.borderRadius = "4px";
  button.style.padding = "20px 30px";
};
