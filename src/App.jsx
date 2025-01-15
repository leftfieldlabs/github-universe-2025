import './typography.css';
import './global.css';

import { useLayoutEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import SplitType from 'split-type';


gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

function App() {
  const main = useRef();
  const smoother = useRef();

  useLayoutEffect(() => {
    const smoothContent = document.getElementById('smooth-content');
    const boxes = Array.from(smoothContent.querySelectorAll('.box'));

    // Get the total height of the container
    const containerHeight = smoothContent.offsetHeight;

    // Calculate the spacing between each element
    const spacing = containerHeight / (boxes.length);

    // Position each box
    boxes.forEach((box, index) => {
      box.style.top = `${spacing * (index)}px`; // Space them evenly
    });
  }, []);

  useGSAP(
    () => {
      smoother.current = ScrollSmoother.create({
        smooth: 2, // seconds it takes to "catch up" to native scroll position
        effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
      });

      const staggeredText = new SplitType('#stagger');
      gsap.to(staggeredText.chars, {
        y: 0,
        stagger: 0.08,
        duration: 0.03,
        scrollTrigger: {
          trigger: '#stagger', // Trigger animation when #split enters the viewport
          markers: true, // Enable markers to debug the animation
          toggleActions: 'play none none none', // Play animation once when it enters the viewport
        },
      })

    },
    { scope: main }
  );


  return (
    <div ref={main}>
      <div id="smooth-content">
        <h1 className="box a" data-speed=".8">How to get a dev's attention:</h1>
        <h1 className="box b" data-speed=".9">Show don't tell.</h1>
        <h1 className="box c" data-speed=".9" id="stagger">Collaborate.</h1>
        <h1 className="box d" data-speed="1.1">Exude #DevEnergy.</h1>
        <h1 className="box e" data-speed="1.2">UNIVERSE is expanding.</h1>
        <h1 className="box f" data-speed="1.3">Meet us at the source of open source.</h1>
        <h1 className="box g" data-speed="1.4">TINSEL x LFL</h1>
      </div>
    </div>
  );
}

export default App;
