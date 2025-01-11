if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service_worker.js").then((registration) => {
      console.log("Service Worker Registered");
  
      // Listen for updates
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New update available
              alert("A new version is available. Please refresh the page.");
            }
          }
        };
      };
    });
  }
  
