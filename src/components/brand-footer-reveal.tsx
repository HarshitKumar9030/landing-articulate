"use client";

import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function BrandFooterReveal() {
  const containerRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Scroll-driven wrappers (The Assembly)
  const layer1ScrollRef = useRef<SVGGElement>(null);
  const layer2ScrollRef = useRef<SVGGElement>(null);
  
  // Mouse-driven inner wrappers (The 3D Parallax)
  const layer1MouseRef = useRef<SVGGElement>(null);
  const layer2MouseRef = useRef<SVGGElement>(null);
  
  const glowRef = useRef<HTMLDivElement>(null);

  // Store gsap quickTo instances for performance
  const xTo1 = useRef<gsap.QuickToFunc | undefined>(undefined);
  const yTo1 = useRef<gsap.QuickToFunc | undefined>(undefined);
  const xTo2 = useRef<gsap.QuickToFunc | undefined>(undefined);
  const yTo2 = useRef<gsap.QuickToFunc | undefined>(undefined);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. The Kinetic Collision (ScrollTrigger)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%", // Start animating just as the section enters
          end: "center center", // Finish assembling when it reaches the middle
          scrub: 1.5, // 1.5 second smoothing for buttery interpolation
        },
      });

      // Ambient background glow expands
      tl.fromTo(
        glowRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, ease: "power2.out" },
        0
      );

      // Fade in the overall canvas
      tl.fromTo(
        svgRef.current,
        { opacity: 0 },
        { opacity: 1, ease: "power2.out" },
        0
      );

      // Layer 1 (Solid) flies in from deep top-left
      // transformOrigin is set to the absolute center of the 225x225 SVG canvas
      tl.fromTo(
        layer1ScrollRef.current,
        { x: -800, y: -600, rotation: -135, scale: 0.5, transformOrigin: "112px 112px" },
        { x: 0, y: 0, rotation: 0, scale: 1, ease: "back.out(1.2)" },
        0
      );

      // Layer 2 (Translucent) flies in from deep bottom-right
      tl.fromTo(
        layer2ScrollRef.current,
        { x: 800, y: 600, rotation: 135, scale: 0.5, transformOrigin: "112px 112px" },
        { x: 0, y: 0, rotation: 0, scale: 1, ease: "back.out(1.2)" },
        0
      );

      // 2. Setup High-Performance Mouse Parallax (quickTo)
      // We target the INNER refs so they don't fight the scroll animation
      xTo1.current = gsap.quickTo(layer1MouseRef.current, "x", { duration: 0.6, ease: "power3" });
      yTo1.current = gsap.quickTo(layer1MouseRef.current, "y", { duration: 0.6, ease: "power3" });
      
      xTo2.current = gsap.quickTo(layer2MouseRef.current, "x", { duration: 0.8, ease: "power3" });
      yTo2.current = gsap.quickTo(layer2MouseRef.current, "y", { duration: 0.8, ease: "power3" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (!containerRef.current || !xTo1.current || !yTo1.current || !xTo2.current || !yTo2.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize mouse position from -1 to 1 based on the container center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Layer 1 moves away from the cursor
    xTo1.current(x * -18);
    yTo1.current(y * -18);

    // Layer 2 moves towards the cursor, creating a 3D intersection
    xTo2.current(x * 25);
    yTo2.current(y * 25);
  };

  const handleMouseLeave = () => {
    // Snap back to origin when mouse leaves
    if (xTo1.current && yTo1.current && xTo2.current && yTo2.current) {
      xTo1.current(0);
      yTo1.current(0);
      xTo2.current(0);
      yTo2.current(0);
    }
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Ensure overflow is hidden on the section so flying pieces don't cause horizontal scrolling
      className="relative flex min-h-[75vh] w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-32"
    >
      {/* Editorial Divider */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px w-full max-w-[1600px] bg-[color:color-mix(in_srgb,var(--ink)_10%,transparent)]" />

      {/* Dynamic Ambient Glow */}
      <div 
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_5%,transparent)_0%,transparent_60%)] blur-[100px]" 
      />

      {/* GSAP SVG Wrapper */}
      <div className="flex w-full flex-col items-center justify-center z-10">
        <div className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[440px]">
          <svg 
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 224.87999 225" 
            className="h-full w-full overflow-visible" 
            preserveAspectRatio="xMidYMid meet" 
            version="1.0"
          >
            <defs>
              <clipPath id="8bf9af670b"><path d="M 20 0.0585938 L 204 0.0585938 L 204 224.9375 L 20 224.9375 Z M 20 0.0585938 " clipRule="nonzero"/></clipPath>
              <clipPath id="3d10a1724a"><path d="M 1 10.039062 L 126.757812 10.039062 L 126.757812 149.953125 L 1 149.953125 Z M 1 10.039062 " clipRule="nonzero"/></clipPath>
              <clipPath id="307894eb28"><path d="M 119.554688 91.828125 L 21.8125 147.828125 C 17.511719 150.292969 12.222656 150.277344 7.929688 147.792969 C 3.640625 145.304688 1 140.722656 1 135.761719 L 1 24.042969 C 1 19.085938 3.640625 14.503906 7.929688 12.015625 C 12.222656 9.53125 17.511719 9.515625 21.8125 11.980469 L 119.554688 67.980469 C 123.828125 70.429688 126.464844 74.976562 126.464844 79.902344 C 126.464844 84.828125 123.828125 89.378906 119.554688 91.828125 Z M 119.554688 91.828125 " clipRule="nonzero"/></clipPath>
              <clipPath id="925e29b189"><path d="M 0 0.0390625 L 125.5625 0.0390625 L 125.5625 139.953125 L 0 139.953125 Z M 0 0.0390625 " clipRule="nonzero"/></clipPath>
              <clipPath id="cc2ef21989"><path d="M 118.554688 81.828125 L 20.8125 137.828125 C 16.511719 140.292969 11.222656 140.277344 6.929688 137.792969 C 2.640625 135.304688 0 130.722656 0 125.761719 L 0 14.042969 C 0 9.085938 2.640625 4.503906 6.929688 2.015625 C 11.222656 -0.46875 16.511719 -0.484375 20.8125 1.980469 L 118.554688 57.980469 C 122.828125 60.429688 125.464844 64.976562 125.464844 69.902344 C 125.464844 74.828125 122.828125 79.378906 118.554688 81.828125 Z M 118.554688 81.828125 " clipRule="nonzero"/></clipPath>
              <clipPath id="7429986b59"><rect x="0" width="126" y="0" height="140"/></clipPath>
              <clipPath id="c26bd82e1c"><path d="M 58.453125 74.503906 L 183.875 74.503906 L 183.875 215 L 58.453125 215 Z M 58.453125 74.503906 " clipRule="nonzero"/></clipPath>
              <clipPath id="6724dd1284"><path d="M 65.664062 132.855469 L 163.09375 76.707031 C 167.382812 74.234375 172.664062 74.238281 176.949219 76.714844 C 181.234375 79.191406 183.875 83.765625 183.875 88.71875 L 183.875 200.949219 C 183.875 205.898438 181.234375 210.476562 176.949219 212.953125 C 172.664062 215.429688 167.382812 215.429688 163.09375 212.960938 L 65.664062 156.8125 C 61.382812 154.34375 58.742188 149.777344 58.742188 144.832031 C 58.742188 139.890625 61.382812 135.324219 65.664062 132.855469 Z M 65.664062 132.855469 " clipRule="nonzero"/></clipPath>
              <clipPath id="6070ad2b27"><path d="M 0.679688 0.503906 L 125.875 0.503906 L 125.875 141 L 0.679688 141 Z M 0.679688 0.503906 " clipRule="nonzero"/></clipPath>
              <clipPath id="2b6a3bafa3"><path d="M 7.664062 58.855469 L 105.09375 2.707031 C 109.382812 0.234375 114.664062 0.238281 118.949219 2.714844 C 123.234375 5.191406 125.875 9.765625 125.875 14.71875 L 125.875 126.949219 C 125.875 131.898438 123.234375 136.476562 118.949219 138.953125 C 114.664062 141.429688 109.382812 141.429688 105.09375 138.960938 L 7.664062 82.8125 C 3.382812 80.34375 0.742188 75.777344 0.742188 70.832031 C 0.742188 65.890625 3.382812 61.324219 7.664062 58.855469 Z M 7.664062 58.855469 " clipRule="nonzero"/></clipPath>
              <clipPath id="455f346958"><rect x="0" width="126" y="0" height="141"/></clipPath>
              <clipPath id="f16b2fc4f4"><rect x="0" width="184" y="0" height="225"/></clipPath>
            </defs>
            
            <g clipPath="url(#8bf9af670b)">
              <g transform="matrix(1, 0, 0, 1, 20, 0)">
                <g clipPath="url(#f16b2fc4f4)">
                  
                  {/* --- LAYER 1: Solid Base --- */}
                  {/* Scroll Wrapper */}
                  <g ref={layer1ScrollRef}>
                    {/* Mouse Wrapper */}
                    <g ref={layer1MouseRef}>
                      <g clipPath="url(#3d10a1724a)">
                        <g clipPath="url(#307894eb28)">
                          <g transform="matrix(1, 0, 0, 1, 1, 10)">
                            <g clipPath="url(#7429986b59)">
                              <g clipPath="url(#925e29b189)">
                                <g clipPath="url(#cc2ef21989)">
                                  <rect x="-102.856" width="388.592" fill="var(--ink)" y="-91.9" height="388.8" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                  
                  {/* --- LAYER 2: Translucent Overlap --- */}
                  {/* Scroll Wrapper */}
                  <g ref={layer2ScrollRef} className="mix-blend-multiply dark:mix-blend-screen">
                    {/* Mouse Wrapper */}
                    <g ref={layer2MouseRef}>
                      <g clipPath="url(#c26bd82e1c)">
                        <g clipPath="url(#6724dd1284)">
                          <g transform="matrix(1, 0, 0, 1, 58, 74)">
                            <g clipPath="url(#455f346958)">
                              <g clipPath="url(#6070ad2b27)">
                                <g clipPath="url(#2b6a3bafa3)">
                                  <path fill="color-mix(in_srgb, var(--ink) 40%, transparent)" d="M 125.875 -9.269531 L 125.875 150.898438 L -13.121094 150.898438 L -13.121094 -9.269531 Z M 125.875 -9.269531 " />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>

                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}