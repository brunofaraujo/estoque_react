export const particlesOptions = {
  key: "linkTriangles",
  name: "Link Triangles",
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#c85129",
      animation: {
        enable: true,
        speed: 1,
        sync: true,
      },
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.7,
    },
    size: {
      value: {
        min: 1,
        max: 5,
      },
    },
    links: {
      enable: true,
      distance: 120,
      color: "random",
      opacity: 1,
      width: 0.5,
      triangles: {
        enable: true,
        color: "#607d8b",
        opacity: 0.1,
      },
    },
    move: {
      enable: true,
      speed: 0.5,
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
      onClick: {
        enable: true,
        mode: "attract",
      },
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 200,
        size: 40,
        duration: 2,
        opacity: 1,
      },
      repulse: {
        distance: 60,
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
      },
    },
  },
  fullScreen: { enable: false, zIndex: 100 },
};
