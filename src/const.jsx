import { TinselXLFL, ExplodingText, ExplodingTextExample } from './Icons';

export const messages = [
  {
    swipeColor: "#2d2d2d",
    swipeDirection: "top-to-bottom",
    textAnimation: null,
    element: (
      <h1
        className="masked-text"
        style={{
          color: "#f1eede",
        }}
      >
        How to get a dev's attention...
      </h1>
    ),
  },
  {
    swipeColor: "#e2c594",
    swipeDirection: "left-to-right",
    textAnimation: "staggered-text",
    element: (
      <h1
        className="masked-text"
        style={{
          color: "#f1eede",
        }}
      >
        Show, don't tell.
      </h1>
    ),
  },
  {
    swipeColor: "#f1eede",
    swipeDirection: "top-to-bottom",
    textAnimation: "staggered-text",
    element: (

      <h1
        className="masked-text"
        style={{
          color: "#f1eede",
        }}
      >
        Collaborate.
      </h1>
    )
  },
  {
    swipeColor: "#2d2d2d",
    swipeDirection: "left-to-right",
    textAnimation: "staggered-text",
    element: (
      <h1
        className="masked-text"
        style={{
          color: "#f1eede",
        }}
      >
        Exude #DevEnergy.
      </h1>
    )
  },
  {
    swipeColor: "#e2c594",
    swipeDirection: "top-to-bottom",
    textAnimation: null,
    element: (
      <ExplodingText />
    )
  },
  {
    swipeColor: "#f1eede",
    swipeDirection: "left-to-right",
    textAnimation: null,
    element: (
      <h1
        className="masked-text"
        style={{
          color: "#f1eede",
        }}
      >
        Meet us at the source of open source.
      </h1>
    )
  },
  {
    swipeColor: "#2d2d2d",
    swipeDirection: "top-to-bottom",
    textAnimation: null,
    element: (
      <div className="final-message">
        <TinselXLFL />
      </div>
    )
  },
];
