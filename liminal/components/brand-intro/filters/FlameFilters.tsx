export function FlameFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="liminal-flame-left" x="-45%" y="-35%" width="190%" height="190%" colorInterpolationFilters="sRGB">
          <feTurbulence data-turbulence="left" type="fractalNoise" baseFrequency="0.012 0.036" numOctaves="1" seed="7" result="noise" />
          <feDisplacementMap data-displacement="left" in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liminal-flame-right" x="-45%" y="-35%" width="190%" height="190%" colorInterpolationFilters="sRGB">
          <feTurbulence data-turbulence="right" type="fractalNoise" baseFrequency="0.017 0.029" numOctaves="1" seed="19" result="noise" />
          <feDisplacementMap data-displacement="right" in="SourceGraphic" in2="noise" scale="4" xChannelSelector="B" yChannelSelector="R" />
        </filter>
      </defs>
    </svg>
  );
}
