// a function that calls the argument handleRemoveNotification to set the notification into its default state and adding animation into it before calling that argument
export function removeNotif<T extends HTMLDivElement>(
  refElement: T,
  handleRemoveNotification: () => void
): void {
  if (refElement.classList.contains("animate-toLeft"))
    refElement.classList.remove("animate-toLeft");

  refElement.classList.add("animate-toRight");
  setTimeout(handleRemoveNotification, 1000);
}
