import "./typography.css";
import "./global.css";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { messages } from "./const";
import { useSwipeable } from "react-swipeable";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrollToPlugin
);

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function App() {
  const main = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentlyAnimating, setCurrentlyAnimating] = useState(false);

  // Handle mouse scroll
  const handleScroll = (event) => {
    if (currentlyAnimating) return; // Prevents triggering new animations while one is in progress

    const delta = event.deltaY; // Get scroll direction (-1 or 1)
    const sign = Math.sign(delta); // Get the sign of the delta
    triggerAnimation(currentIndex + sign);
  };

  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => triggerAnimation(currentIndex + 1),  // Swipe left
    onSwipedRight: () => triggerAnimation(currentIndex - 1), // Swipe right
    onSwipedUp: () => triggerAnimation(currentIndex + 1),    // Swipe up
    onSwipedDown: () => triggerAnimation(currentIndex - 1),  // Swipe down
    preventScrollOnSwipe: true,
    trackMouse: true, // Enables swipe gestures with mouse drag
  });

  useEffect(() => {
    triggerAnimation(0);
  }, []);

  useEffect(() => {
    console.log("currentIndex:", currentIndex);
  }, [currentIndex]);

  // Helper function to calculate starting position for intro animation
  const getFromPosition = (direction) => {
    switch (direction) {
      case "left":
        return { x: "-100%", y: 0 };
      case "top":
        return { x: 0, y: "-100%" };
      case "right":
        return { x: "100%", y: 0 };
      case "bottom":
        return { x: 0, y: "100%" };
      default:
        return { x: 0, y: 0 };
    }
  };

  // Helper function to calculate reverse position for outro animation
  const getReversePosition = (direction) => {
    switch (direction) {
      case "left":
        return { x: "100%", y: 0 }; // Reverse of coming in from the left
      case "top":
        return { x: 0, y: "100%" }; // Reverse of coming in from the top
      case "right":
        return { x: "-100%", y: 0 }; // Reverse of coming in from the right
      case "bottom":
        return { x: 0, y: "-100%" }; // Reverse of coming in from the bottom
      default:
        return { x: 0, y: 0 };
    }
  };

  const triggerAnimation = (next) => {
    if (next < 0 || next >= messages.length) return;

    const isFirstTrigger = currentIndex === 0 && next === 0;
    const textAnimation = messages[next].textAnimation;

    const currentText = isFirstTrigger ? null : main.current.querySelector(`.message-${currentIndex}`);
    const nextText = main.current.querySelector(`.message-${next}`);
    if (currentText) currentText.style.opacity = 1;
    nextText.style.opacity = 1;

    console.log("currentText:", currentText);
    console.log("nextText:", nextText);

    const currentSplitText = messages[currentIndex].text ? new SplitText(currentText) : null;
    const nextSplitText = messages[next].text ? new SplitText(nextText) : null;

    const currentMask = main.current.querySelector(`.swipe-mask.message-${currentIndex}`);
    const nextMask = main.current.querySelector(`.swipe-mask.message-${next}`);

    const isReverse = next < currentIndex; // Determine if we're going backward
    const currentDirection = messages[currentIndex].swipeDirection;
    const nextDirection = messages[next].swipeDirection;

    // Calculate the reverse position for the current mask when going backward
    const reversePosition = getReversePosition(currentDirection);
    const nextPosition = getFromPosition(nextDirection);

    const timeline = gsap.timeline({
      onStart: () => {
        setCurrentlyAnimating(true);
      },
      onComplete: () => {
        setCurrentIndex(next);
        setCurrentlyAnimating(false);
      },
    });

    // Animate the current mask out of view (reverse if needed)
    timeline.to(
      currentMask,
      {
        ...reversePosition,
        autoAlpha: 1,
        duration: 1,
        ease: "power2.in",
      },
    );

    // Intro animation for the next swipe mask
    timeline.fromTo(
      nextMask,
      { ...nextPosition, autoAlpha: 1 },
      {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power2.out"
      },
      "<"
    );

    // Outro animation for the current text
    timeline.to(
      currentSplitText ? currentSplitText.chars : currentText,
      {
        y: isReverse ? -50 : 50,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in",
      }
    );

    switch (textAnimation) {
      case "burn":
        const shuffledNextSplitText = shuffle(nextSplitText.chars);
        timeline.fromTo(shuffledNextSplitText,
          {
            autoAlpha: 0,
            y: 5,
            textShadow: "0px 0px 16px rgb(255, 255, 255)",
            color: "transparent"
          },
          {
            duration: 1.5,
            stagger: 0.01,
            autoAlpha: 1,
            y: 0,
            textShadow: "0px 0px 0px rgb(255, 255, 255)",
            color: messages[next].textColor
          }
        )
        break;
      case "explode":
        const e = nextText.querySelectorAll(".exploding-text rect");

        let introXDelay = 1;
        let introYDelay = 1.25;
        let outroXDelay = 3;
        let outroYDelay = 3.25;

        for (let i = 0; i < e.length; i++) {
          let p = e[i];

          // Intro animation: Start outside the frame and move into position
          introXDelay += 0.005;
          introYDelay += 0.005;

          gsap.set(p, {
            autoAlpha: 0,
            x: random(120, 160), // Start from exploded positions
            y: random(-20, -60),
          });

          gsap.to(p, {
            delay: introXDelay,
            duration: 0.75,
            autoAlpha: 1,
            x: 0,
            y: 0,
            ease: "power2.out",
          });

          // Outro animation: Blow away
          outroXDelay += 0.005;
          outroYDelay += 0.005;

          gsap.to(p, {
            delay: outroXDelay + 1.5, // Delay to allow intro animation to finish
            duration: 1.0,
            autoAlpha: 0,
            x: random(120, 160), // Move back to exploded positions
            ease: "power2.in",
          });

          gsap.to(p, {
            delay: outroYDelay + 1.5, // Match delay with x-axis movement
            duration: 0.75,
            y: random(-20, -60),
            ease: "power2.in",
          });
        }
        break;
      default:
        // Stagger animation for the next text (characters)
        timeline.fromTo(
          nextSplitText ? nextSplitText.chars : nextText,
          {
            y: isReverse ? -50 : 50,  // Adjust based on reverse
            opacity: isReverse ? 1 : 0, // Visible if reverse
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.05,
            delay: 0.5,
          }
        );
        break;
    }
  }

  return (
    <div
      {...handlers}
      onWheel={handleScroll}
    >
      <div id="main" ref={main}>
        {messages.map((message, index) => (
          <div className="box" key={index}>
            {message.text &&
              <h1
                className={`masked-text message-${index}`}
                style={{
                  wordBreak: "keep-all",
                  textWrap: message.noWrap ? "nowrap" : "normal",
                  color: message.textColor,
                }}
              >
                {message.text}
              </h1>
            }
            {message.element &&
              <div className={`element message-${index}`}>
                {message.element}
              </div>}
          </div>

        ))}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`swipe-mask message-${index}`}
            style={{
              background: message.swipeColor,
            }}
          />
        ))}
      </div>
    </div>

  );
}

export default App;
