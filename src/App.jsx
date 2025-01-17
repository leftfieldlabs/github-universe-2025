import "./typography.css";
import "./global.css";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { getClipPaths } from "./utils";
import { messages } from "./const";
import { TinselXLFL } from './Icons';

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrollToPlugin
);

function App() {
  const main = useRef();
  const textContainer = useRef();

  useGSAP(() => {
    const boxElements = Array.from(textContainer.current.querySelectorAll('.box'));
    let isAnimating = false;

    boxElements.forEach((box, index) => {
      const swipeMask = box.querySelector('.swipe-mask');
      const maskedText = box.querySelector('h1');
      const { swipeDirection } = messages[index];
      const { textAnimation } = messages[index];
      const clipPaths = getClipPaths(swipeDirection);

      console.log(
        "swipeMask:", swipeMask,
        "text:", maskedText,
        "swipeDirection:", swipeDirection,
        "initialClipPath:", clipPaths[0],
        "finalClipPath:", clipPaths
      )

      // Set initial states
      gsap.set(maskedText, { autoAlpha: 0 });
      const staggeredText = textAnimation === "staggered-text" ? new SplitText(maskedText) : null;
      gsap.set(swipeMask, { clipPath: clipPaths[0] });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: box,
          debug: true,
          start: "top 90%",
          end: "bottom 10%",
          onEnter: () => {
            console.log("onEnter", maskedText)
            if (isAnimating) return; // Prevent triggering while animating
            isAnimating = true;

            gsap.to(maskedText, { autoAlpha: 1, duration: 1.8, ease: 'power2.inOut' });
            if (textAnimation === "staggered-text") {
              gsap.from(staggeredText.chars, {
                duration: 0.2,
                y: '100%',
                autoAlpha: 1,
                stagger: 0.05
              });
            }

            tl.to(window, {
              scrollTo: box, // Scroll to this box smoothly when entering from below
              duration: 0.5,
              onComplete: () => {
                isAnimating = false; // Reset the flag after animation is done
              },
            })

            clipPaths.forEach((clipPath, i) => {
              gsap.to(swipeMask, {
                clipPath: clipPath,
                duration: 0.5, // Adjust duration per clip path
                ease: 'none',
                delay: 0.4
              });
            });
          },
          onLeave: () => {
            console.log("onLeave", maskedText)
            tl.to(maskedText, { autoAlpha: 0, duration: 1.8, ease: 'power2.inOut' }); // Fade out
          },
          onEnterBack: () => {
            if (isAnimating) return; // Prevent triggering while animating
            isAnimating = true;

            console.log("onEnterBack", maskedText)

            gsap.to(maskedText, { autoAlpha: 1, duration: 1.8, ease: 'power2.inOut' });
            if (textAnimation === "staggered-text") {
              gsap.from(staggeredText.chars, {
                duration: 0.2,
                y: '100%',
                autoAlpha: 1,
                stagger: 0.05
              });
            }

            tl.to(window, {
              scrollTo: box, // Scroll to this box smoothly when entering from below
              duration: 0.5,
              onComplete: () => {
                isAnimating = false; // Reset the flag after animation is done
              },
            })


          },
          onLeaveBack: () => {
            console.log("onLeaveBack", maskedText)
            tl.add([
              gsap.to(maskedText, { autoAlpha: 0, duration: 1.8, ease: 'power2.inOut' }),
              gsap.to(swipeMask, { clipPath: clipPaths[0], duration: 1.2, ease: 'power2.inOut' })
            ]);
          }
        }
        //   trigger: box,
        //   debug: true,
        //   start: "top 99%",
        //   end: "bottom 15%",
        //   onEnter: () => {
        //     console.log("onEnter", maskedText)
        //     if (isAnimating) return; // Prevent triggering while animating
        //     isAnimating = true;

        //     gsap.to(window, {
        //       scrollTo: box, // Scroll to this box smoothly when entering from below
        //       duration: 0.5,
        //       onComplete: () => {
        //         isAnimating = false; // Reset the flag after animation is done
        //       },
        //     });
        //     gsap.to(maskedText, { opacity: 1, duration: 1.2, delay: 0.5, ease: 'power2.inOut' }); // Fade in
        //     gsap.to(swipeMask, { clipPath: finalClipPath, duration: 1.2, delay: 0.5, ease: 'power2.inOut' });
        //   },
        //   onLeave: () => {
        //     console.log("onLeave", maskedText)
        //     gsap.to(maskedText, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }); // Fade out
        //   },
        //   onEnterBack: () => {
        //     if (isAnimating) return; // Prevent triggering while animating
        //     isAnimating = true;

        //     console.log("onEnterBack", maskedText)
        //     gsap.to(window, {
        //       scrollTo: box, // Scroll to this box smoothly when entering from below
        //       duration: 0.5,
        //       onComplete: () => {
        //         isAnimating = false; // Reset the flag after animation is done
        //       },
        //     });
        //     gsap.to(maskedText, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }); // Fade in (reverse)
        //   },
        //   onLeaveBack: () => {
        //     console.log("onLeaveBack", maskedText)
        //     gsap.to(maskedText, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }); // Fade out (reverse)
        //     gsap.to(swipeMask, { clipPath: initialClipPath, duration: 1.2, delay: 0.5, ease: 'power2.inOut' });
        //   },
        // });
      });
    });

    // ScrollTrigger.refresh();
  }, { scope: main }); // <-- scope is for selector text (optional)

  return (
    <div id="main" ref={main}>
      <div id="text-container" ref={textContainer}>
        {messages.map((message, index) => (
          <div className="box" key={index}>
            <div
              className="swipe-mask"
              style={{
                background: message.swipeColor,
              }}
            />
            {index === messages.length - 1 ? (
              <div className="final-message">
                <TinselXLFL />
                <a href="https://www.google.com/" target="_blank">
                  <h4>
                    Go to deck
                  </h4>
                </a>
              </div>
            ) : <h1
              className="masked-text"
              style={{
                color: message.textColor,
              }}
            >
              {message.text}
            </h1>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
