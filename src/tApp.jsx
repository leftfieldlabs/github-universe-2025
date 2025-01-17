import './typography.css';
import './global.css';

import { useLayoutEffect, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, ScrollToPlugin);

function App() {
  const main = useRef();
  const textContainer = useRef();

  const getClipPaths = (swipeDirection) => {
    let initialClipPath, finalClipPath;

    switch (swipeDirection) {
      case "left-to-right":
        initialClipPath = "polygon(0 0, 0 100%, 0 100%, 0 0)";
        finalClipPath = "polygon(0 0, 0 100%, 100% 100%, 100% 0)";
        break;
      case "right-to-left":
        initialClipPath = "polygon(100% 0, 100% 100%, 100% 100%, 100% 0)";
        finalClipPath = "polygon(0 0, 0 100%, 100% 100%, 100% 0)";
        break;
      case "top-to-bottom":
        initialClipPath = "polygon(0 0, 0 0, 100% 0, 100% 0)";
        finalClipPath = "polygon(0 0, 0 100%, 100% 100%, 100% 0)";
        break;
      case "top-left-to-bottom-right":
        initialClipPath = "polygon(0 0, 0 0, 0 0, 0 0)";
        finalClipPath = "polygon(0 0, 0 100%, 100% 100%, 100% 0)";
        break;
      case "top-right-to-bottom-left":
        initialClipPath = "polygon(100% 0, 100% 0, 100% 0, 100% 0)";
        finalClipPath = "polygon(0 0, 0 100%, 100% 100%, 100% 0)";
        break;
      default:
        // Default is left-to-right
        initialClipPath = "polygon(0 0, 0 100%, 0 100%, 0 0)";
        finalClipPath = "polygon(0 0, 0 100%, 100% 100%, 100% 0)";
        break;
    }

    return { initialClipPath, finalClipPath };
  }

  useLayoutEffect(() => {
    const boxElements = Array.from(textContainer.current.querySelectorAll('.box'));

    boxElements.forEach((box, index) => {
      const text = box.querySelector('h1');
      const staggeredText = new SplitText(text);
      gsap.set(text, { autoAlpha: 0 });

      const swipeMask = box.querySelector('.swipe-mask');
      const { swipeDirection } = messages[index];
      const { initialClipPath, finalClipPath } = getClipPaths(swipeDirection);
      gsap.set(swipeMask, { clipPath: initialClipPath });

      ScrollTrigger.create({
        trigger: text,
        start: "top 75%", // Start animation when the element enters the viewport
        end: "bottom 25%", // End animation when the element starts to exit the viewport
        toggleActions: "play reverse play reverse",
        markers: false, // Debug markers (optional)
        onEnter: () => {
          gsap.to(swipeMask, {
            clipPath: finalClipPath, // Expand to fully cover
            duration: 0.8,
            ease: "sine",
          });
          gsap.to(text, { autoAlpha: 1, duration: 0.5 });
          // gsap.from(staggeredText.chars, {
          //   duration: 0.2,
          //   y: '100%',
          //   autoAlpha: 1,
          //   stagger: 0.05,
          //   delay: 0.5,
          // });
        },
        onEnterBack: () => {
          gsap.to(swipeMask, {
            clipPath: finalClipPath, // Expand to fully cover
            duration: 0.5,
            ease: "sine",
          });
          gsap.to(text, { autoAlpha: 1, duration: 0.5 });
          // gsap.from(staggeredText.chars, {
          //   duration: 0.2,
          //   y: '100%',
          //   autoAlpha: 1,
          // });
        },
        onLeave: () => {
          gsap.to(text, { autoAlpha: 0, duration: 0.5 });
        },
        onLeaveBack: () => {
          gsap.to(swipeMask, {
            clipPath: initialClipPath, // Revert back to initial state
            duration: 0.5,
            ease: "sine",
          });
          gsap.to(text, { autoAlpha: 0, duration: 0.5 });
        }
      });
    });

    // Initialize ScrollSmoother
    // const smoother = ScrollSmoother.create({
    //   smooth: 1.5, // Smoothness factor (higher = smoother)
    //   effects: true, // Enable smooth scroll effects
    // });

    // Snap to sections using ScrollTrigger
    boxElements.forEach((box) => {
      ScrollTrigger.create({
        trigger: box,
        start: "top center", // Trigger when the top of the box hits the center of the viewport
        end: "bottom center", // End when the bottom of the box hits the center
        onEnter: () => {
          gsap.to(window, {
            scrollTo: box, // Scroll to this box smoothly when entering from below
            duration: 0.6,
            ease: "power3.inOut",
          });
        },
        // onEnterBack: () => {
        //   gsap.to(window, {
        //     scrollTo: box, // Scroll to this box smoothly when entering from above
        //     duration: 0.6,
        //     ease: "power3.inOut",
        //   });
        // },
      });
    });
  }, []);

  const messages = [
    {
      text: "How to get a dev's attention...",
      swipeColor: "#e2c594",
      swipeDirection: "top-left-to-bottom-right",
      textColor: "blueviolet",
    },
    {
      text: "Show, don't tell.",
      swipeColor: "linear-gradient(to left, #ff007a, #df5090)",
      swipeDirection: "left-to-right",
      textColor: "#ffffff",
    },
    {
      text: "Collaborate.",
      swipeColor: "linear-gradient(to bottom, #00ff7a, #50df90)",
      swipeDirection: "top-to-bottom",
      textColor: "#ffffff",
    },
    {
      text: "Exude #DevEnergy.",
      swipeColor: "linear-gradient(to right, #ff7a00, #df9050)",
      swipeDirection: "left-to-right",
      textColor: "#ffffff",
    },
    {
      text: "UNIVERSE is expanding.",
      swipeColor: "linear-gradient(to left, #007aff, #5090df)",
      swipeDirection: "right-to-left",
      textColor: "#333333",
    },
    {
      text: "Meet us at the source of open source.",
      swipeColor: "linear-gradient(to bottom, #7a00ff, #9050df)",
      swipeDirection: "left-to-right",
      textColor: "#333333",
    },
    {
      text: "TINSEL x LFL",
      swipeColor: "linear-gradient(to right, #ff00ff, #df50df)",
      swipeDirection: "top-to-bottom",
      textColor: "#ffffff",
    }
  ];

  return (
    <div id="main" ref={main} style={{ height: '100vh', overflow: 'auto' }}>
      {/* <div id="grid-background" /> */}
      <div
        id="text-container"
        ref={textContainer}
      >
        {messages.map((message, index) => (
          <div className="box" key={index}>
            <div
              className="swipe-mask"
              style={{
                background: message.swipeColor,
              }}
            />
            <h1
              className="masked-text"
              style={{
                color: message.textColor,
              }}
            >
              {message.text}
            </h1>
            {index === messages.length - 1 && (
              <a href="https://www.google.com/" target="_blank">
                <h4>
                  Go to deck
                  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="white">
                    <polygon points="7 7 15.586 7 5.293 17.293 6.707 18.707 17 8.414 17 17 19 17 19 5 7 5 7 7" />
                  </svg>
                </h4>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
