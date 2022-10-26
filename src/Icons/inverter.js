const iconText = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 210 210">
    <defs>
        <style>
        .stroke {
            stroke: #000;
            stroke-width: 8px;
            stroke-linecap: round;
          }
          .stroke-bold {
            stroke: #000;
            stroke-width: 16px;
            stroke-linecap: round;
          }
          
          .wave {
            stroke: #000;
            fill: transparent;
            stroke-width: 12px;
            stroke-linecap: round;
          }
          
          .cls-1-inv {
            fill: transparent;
            stroke-linejoin: round;
            stroke-width: 8px;
          }
        </style>
    </defs>
    <g id="Inverter">
        <rect
        class="cls-1-inv stroke"
        width="188"
        height="188"
        x="5"
        y="5"
        rx="15"
        />
        <line class="stroke" x1="10" x2="190" y1="190" y2="10"></line>
        <line
            class="stroke stroke-bold"
            x1="88"
            x2="168"
            y1="140"
            y2="140"
        ></line>
        <line
            class="stroke stroke-bold"
            x1="88"
            x2="168"
            y1="168"
            y2="168"
        ></line>
        <path
            class="wave"
            d="M 10,30 Q 25,60 40,30 t 30,0 30,0"
            transform="translate(12 12)"
        ></path>
    </g>
</svg>`;

export default iconText;
