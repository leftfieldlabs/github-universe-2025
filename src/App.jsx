import './typography.css';
import './global.css';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
// import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
// import { ScrambleTextPlugin } from 'gsap-trial/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

function App() {
  const main = useRef();
  const smoother = useRef();

  // const scrollTo = () => {
  //   smoother.current.scrollTo('.box-c', true, 'center center');
  // };

  useGSAP(
    () => {
      // create the smooth scroller FIRST!
      smoother.current = ScrollSmoother.create({
        smooth: 2, // seconds it takes to "catch up" to native scroll position
        effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
      });
      // gsap.to(element, {
      //   duration: 1,
      //   scrambleText: "THIS IS NEW TEXT"
      // });
      // ScrollTrigger.create({
      //   trigger: '.box-c',
      //   pin: true,
      //   start: 'center center',
      //   end: '+=300',
      //   markers: true,
      // });
    },
    { scope: main }
  );


  return (

    <div ref={main}>
      <div id="smooth-content">
        <h1 className="box a" data-speed=".8">How to get a dev's attention:</h1>
        <h1 className="box b" data-speed=".9">Show don't tell.</h1>
        <h1 className="box c" data-speed="1">Collaborate.</h1>
        <h1 className="box d" data-speed="1.1">Exude #DevEnergy.</h1>
      </div>
    </div>

  );
}

export default App;
