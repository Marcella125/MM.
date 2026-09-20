// Shared, restrained entrance values for content that benefits from a reveal.
// Keep section-specific choreography in its own component.
export const entranceEase = [0.22, 1, 0.36, 1] as const;

export const entrance = {
  lift: 22,
  scale: 0.985,
  opacity: 0,
  duration: 0.58,
  stagger: 0.065,
} as const;
