import './typography.css';
import './global.css';

import { useLayoutEffect, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

function App() {
  const main = useRef();
  const textContainer = useRef();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useLayoutEffect(() => {
    const textElements = Array.from(textContainer.current.querySelectorAll('.box h1'));

    // Add ScrollTrigger for each text element
    textElements.forEach((text) => {
      gsap.set(text, { autoAlpha: 0 }); // Ensure they start hidden and unrotated
      const staggeredText = new SplitText(text);

      ScrollTrigger.create({
        trigger: text,
        start: "top 75%", // Start animation when the element enters the viewport
        end: "bottom 25%", // End animation when the element starts to exit the viewport
        toggleActions: "play reverse play reverse", // Control the animation lifecycle
        markers: false, // Debug markers (optional)
        onEnter: () => {
          gsap.to(text, { autoAlpha: 1, duration: 0.5 }); // Fade in
          gsap.from(staggeredText.chars, {
            duration: 0.2,
            y: '100%',
            autoAlpha: 1,
            stagger: 0.05
          });
        },
        onEnterBack: () => {
          gsap.to(text, { autoAlpha: 1, duration: 0.5 }); // Fade out
          gsap.from(staggeredText.chars, {
            duration: 0.2,
            y: '100%',
            autoAlpha: 1,
            stagger: 0.05
          });
        },
        onLeave: () => {
          gsap.to(text, { autoAlpha: 0, duration: 0.5 }); // Fade out
        },
        onLeaveBack: () => {
          gsap.to(text, { autoAlpha: 0, duration: 0.5 }); // Fade in
        }
      });
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fill the canvas with black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Resize canvas on window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Animate a circular reveal
    const revealSplotch = { radius: 0 };

    gsap.to(revealSplotch, {
      radius: 50,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        // Draw the "splotch" on the canvas with a textured edge
        ctx.globalCompositeOperation = "destination-out"; // This makes it reveal the background

        // Create a more jagged, textured edge by adding random noise to the coordinates
        const noiseFactor = 10; // Adjust this for more or less noise
        const randomNoise = (factor) => (Math.random() - 0.5) * factor;

        // Begin drawing the splotch
        ctx.beginPath();

        // Use random noise to give texture to the edges
        const texturedX = x + randomNoise(noiseFactor);
        const texturedY = y + randomNoise(noiseFactor);

        // Create the circle with textured edges
        ctx.arc(texturedX, texturedY, revealSplotch.radius, 0, Math.PI * 2);
        ctx.fill();

        // Optionally, you could make the edge more rough by adding small random lines around the perimeter
        const roughness = 10; // More lines = more roughness
        for (let i = 0; i < roughness; i++) {
          const angle = Math.random() * Math.PI * 2;
          const offsetX = Math.cos(angle) * randomNoise(noiseFactor);
          const offsetY = Math.sin(angle) * randomNoise(noiseFactor);
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, revealSplotch.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    });
  };

  const messages = [
    "How to get a dev's attention...",
    "Show, don't tell.",
    "Collaborate.",
    "Exude #DevEnergy.",
    "UNIVERSE is expanding.",
    "Meet us at the source of open source.",
    "TINSEL x LFL",
  ];

  return (
    <div id="main" ref={main} style={{ height: '100vh', overflow: 'auto' }}>
      <div id="hidden-background" />
      <div id="grid-background" />
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
      />
      <div
        id="text-container"
        ref={textContainer}
      >
        {messages.map((message, index) => (
          <div className='box' key={index}>
            <h1>{message}</h1>
            {index === messages.length - 1 && <a href="https://www.google.com/" target="_blank"><h4>Go to deck<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="white">
              <polygon points="7 7 15.586 7 5.293 17.293 6.707 18.707 17 8.414 17 17 19 17 19 5 7 5 7 7" />
            </svg></h4></a>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
