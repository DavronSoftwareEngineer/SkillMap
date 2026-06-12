export function Topo() {
  return (
    <>
      <div className="topo">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#34D6C0" strokeWidth="1" opacity="0.18">
            <path d="M-50,200 C200,120 400,260 620,200 S1000,90 1250,180 1500,220 1500,220" />
            <path d="M-50,260 C200,190 420,330 640,270 S1000,160 1260,250 1500,290 1500,290" />
            <path d="M-50,330 C220,270 430,400 660,340 S1010,230 1270,320 1500,360 1500,360" />
          </g>
          <g fill="none" stroke="#F4A23C" strokeWidth="1" opacity="0.13">
            <path d="M-50,620 C220,560 430,690 660,640 S1010,540 1270,620 1500,650 1500,650" />
            <path d="M-50,690 C220,640 430,760 660,710 S1010,620 1270,700 1500,730 1500,730" />
            <path d="M-50,760 C220,720 430,830 660,790 S1010,710 1270,780 1500,810 1500,810" />
          </g>
        </svg>
      </div>
      <div className="grid-overlay" />
    </>
  );
}
