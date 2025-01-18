export const getClipPaths = (swipeDirection) => {
  let clipPaths = [];

  switch (swipeDirection) {
    case "top-left-to-bottom-right":
      clipPaths = [
        "polygon(0 0, 0 0, 0 0, 0 0)",
        "polygon(0 0, 0% 100%, 100% 0)",
        "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      ];
      break;
    case "left-to-right":
      clipPaths = [
        "polygon(0 0, 0 100%, 0 100%, 0 0)",
        "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
      ];
      break;
    case "right-to-left":
      clipPaths = [
        "polygon(100% 0, 100% 100%, 100% 100%, 100% 0)",
        "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
      ];
      break;
    case "top-to-bottom":
      clipPaths = [
        "polygon(0 0, 100% 0, 100% 0, 0 0)",
        "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ];
      break;
    case "bottom-to-top":
      clipPaths = [
        "polygon(0 100%, 0 100%, 100% 100%, 100% 100%)",
        "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
      ];
      break;
    default:
      clipPaths = [
        "polygon(0 0, 0 0, 100% 0, 100% 0)",
        "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
      ];
      break;
  }

  return clipPaths;
};
