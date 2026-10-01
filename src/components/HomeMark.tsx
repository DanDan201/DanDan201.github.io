export function HomeMark() {
  return (
    <a className="home-mark" href="#intro" title="Home">
      <svg className="home-mark-icon" viewBox="0 0 32 32" aria-hidden="true">
        {/* Same mark as public/assets/favicon.svg: an "A" drawn as a nose caret over the HUD horizon. */}
        <path className="home-mark-caret" d="M6 27 16 6 26 27" />
        <path className="home-mark-horizon" d="M3 19.5h26" />
      </svg>
      <span className="brackets" aria-hidden="true" />
      <span className="sr-only">Home</span>
    </a>
  );
}
