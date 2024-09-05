export function pauseUntilPlay() {
  return new Promise<void>((resolve) => {
    console.log("Application paused. Type `play()` in the console to continue.");

    (window as any).play = function () {
      console.log("Resuming...");
      resolve();
    };
  });
}