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

function App() {
  const main = useRef();
  const textContainer = useRef();

  useGSAP(() => {
    const boxElements = gsap.utils.toArray('.box');

    boxElements.forEach((box, index) => {


      const swipeMask = box.querySelector('.swipe-mask');
      const maskedText = box.querySelector('h1');
      const explodingPaths = box.querySelectorAll(".exploding-text path");

      console.log("explodingPaths:", explodingPaths);
      const { swipeDirection } = messages[index];
      const { textAnimation } = messages[index];
      const clipPaths = getClipPaths(swipeDirection);
      const staggeredText = textAnimation === "staggered-text" && maskedText ? new SplitText(maskedText) : null;

      console.log(
        "swipeMask:", swipeMask,
        "text:", maskedText,
        "swipeDirection:", swipeDirection,
        "initialClipPath:", clipPaths[0],
        "finalClipPath:", clipPaths
      )

      // Set initial states for text animations
      if (maskedText) gsap.set(maskedText, { autoAlpha: 0 });
      if (explodingPaths.length > 0) {
        console.log("set explodingPaths:", explodingPaths)
        explodingPaths.forEach(p => {
          gsap.set(p, { autoAlpha: 0, y: random(-2, -180), x: random(-200, 200), scale: 0.5 })
        });
      }

      // Set initial state for swipe mask
      if (swipeMask) gsap.set(swipeMask, { clipPath: clipPaths[0] });


      ScrollTrigger.create({
        trigger: box,
        debug: true,
        start: 'top 95%',
        end: '+=500',
        snap: {
          snapTo: 1.5,
          duration: 0.5,
          ease: 'power1.inOut'
        },
        onEnter: () => {
          console.log("onEnter", box)

          /* First: Initiate text enter animation */
          // 1A: Fade in the text
          if (maskedText) gsap.to(maskedText, { autoAlpha: 1, duration: 2, delay: 0.5, ease: 'power2.inOut' });
          // 1C: Un-explode the svg text
          explodingPaths.forEach(p => {
            gsap.to(p, { delay: 1, duration: 0.75, stagger: 0.01, autoAlpha: 1, y: 0, x: 0, scale: 1, ease: "power2.out" });
            gsap.to(p, { duration: 0.5, delay: 5, autoAlpha: 0, y: random(-2, -180), x: random(-200, 200), scale: 0.8 })
          });
          // 1B: Stagger the text
          if (textAnimation === "staggered-text") {
            gsap.from(staggeredText.chars, {
              duration: 0.2,
              delay: 1,
              y: '100%',
              stagger: 0.05
            });
          }

          /* Second: Initiate swipe animation */
          gsap.to(swipeMask, {
            clipPath: clipPaths[1],
            duration: 0.6,
            delay: 2,
            ease: 'none',
          });
        },
      })

      // const tl = gsap.timeline({
      //   scrollTrigger: {
      //     trigger: box,
      //     // pin: true,
      //     // start: "top 95%",
      //     // end: "bottom 5%",
      //     onEnter: () => {
      //       console.log("onEnter", box)

      //       /* First: Initiate swipe animation */
      //       clipPaths.forEach((clipPath, i) => {
      //         gsap.to(swipeMask, {
      //           clipPath: clipPath,
      //           duration: 0.5,
      //           ease: 'none',
      //         });
      //       });

      //       /* Second: Initiate text enter animation */
      //       // 1A: Fade in the text
      //       console.log("fade in text", maskedText);
      //       if (maskedText) gsap.to(maskedText, { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' });

      //       // 1B: Stagger the text
      //       if (textAnimation === "staggered-text") {
      //         gsap.from(staggeredText.chars, {
      //           duration: 0.2,
      //           delay: 0.25,
      //           y: '100%',
      //           stagger: 0.05
      //         });
      //       }
      //       // 1C: Un-explode the svg text
      //       explodingPaths.forEach(p => {
      //         gsap.to(p, {
      //           autoAlpha: 1,
      //           duration: 1.5,
      //           delay: 0.25,
      //           stagger: 0.01,
      //           y: 0,
      //           x: 0,
      //           scale: 1,
      //           ease: "power2.out"
      //         });
      //       });

      //     },
      //     onLeave: () => {
      //       console.log("onLeave", box)
      //       tl.to(maskedText, { autoAlpha: 0, duration: 1.8, ease: 'power2.inOut' }); // Fade out

      //       explodingPaths.forEach(p => {
      //         gsap.to(p, { duration: 0.5, autoAlpha: 0, y: random(-2, -180), x: random(-200, 200), scale: 0.8 })
      //       });
      //     },
      //     onEnterBack: () => {
      //       if (isAnimating) return; // Prevent triggering while animating
      //       isAnimating = true;

      //       console.log("onEnterBack", box)

      //       gsap.to(maskedText, { autoAlpha: 1, duration: 1.8, ease: 'power2.inOut' });
      //       if (textAnimation === "staggered-text") {
      //         gsap.from(staggeredText.chars, {
      //           duration: 0.2,

      //           y: '100%',
      //           autoAlpha: 1,
      //           stagger: 0.05
      //         });
      //       }

      //       // tl.to(window, {
      //       //   scrollTo: box, // Scroll to this box smoothly when entering from below
      //       //   duration: 0.5,
      //       //   onComplete: () => {
      //       //     isAnimating = false; // Reset the flag after animation is done
      //       //   },
      //       // })


      //     },
      //     onLeaveBack: () => {
      //       console.log("onLeaveBack", box)
      //       tl.add([
      //         gsap.to(maskedText, { autoAlpha: 0, duration: 1.8, ease: 'power2.inOut' }),
      //         gsap.to(swipeMask, { clipPath: clipPaths[0], duration: 1.2, ease: 'power2.inOut' })
      //       ]);
      //     }
      //   }
      //   //   trigger: box,
      //   //   debug: true,
      //   //   start: "top 99%",
      //   //   end: "bottom 15%",
      //   //   onEnter: () => {
      //   //     console.log("onEnter", maskedText)
      //   //     if (isAnimating) return; // Prevent triggering while animating
      //   //     isAnimating = true;

      //   //     gsap.to(window, {
      //   //       scrollTo: box, // Scroll to this box smoothly when entering from below
      //   //       duration: 0.5,
      //   //       onComplete: () => {
      //   //         isAnimating = false; // Reset the flag after animation is done
      //   //       },
      //   //     });
      //   //     gsap.to(maskedText, { opacity: 1, duration: 1.2, delay: 0.5, ease: 'power2.inOut' }); // Fade in
      //   //     gsap.to(swipeMask, { clipPath: finalClipPath, duration: 1.2, delay: 0.5, ease: 'power2.inOut' });
      //   //   },
      //   //   onLeave: () => {
      //   //     console.log("onLeave", maskedText)
      //   //     gsap.to(maskedText, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }); // Fade out
      //   //   },
      //   //   onEnterBack: () => {
      //   //     if (isAnimating) return; // Prevent triggering while animating
      //   //     isAnimating = true;

      //   //     console.log("onEnterBack", maskedText)
      //   //     gsap.to(window, {
      //   //       scrollTo: box, // Scroll to this box smoothly when entering from below
      //   //       duration: 0.5,
      //   //       onComplete: () => {
      //   //         isAnimating = false; // Reset the flag after animation is done
      //   //       },
      //   //     });
      //   //     gsap.to(maskedText, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }); // Fade in (reverse)
      //   //   },
      //   //   onLeaveBack: () => {
      //   //     console.log("onLeaveBack", maskedText)
      //   //     gsap.to(maskedText, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }); // Fade out (reverse)
      //   //     gsap.to(swipeMask, { clipPath: initialClipPath, duration: 1.2, delay: 0.5, ease: 'power2.inOut' });
      //   //   },
      //   // });
      // });
    });

    ScrollTrigger.refresh();
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
            {message.element}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
