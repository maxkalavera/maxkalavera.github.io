import type { Config } from "tailwindcss";
import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
			fontFamily: {
        display: ["var(--font-display)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.serif],
      },
			spacing: {
        'header': 'var(--header-height)',
        'footer': 'var(--footer-height)',
        'content': 'var(--content-height)',
				'content-padding': 'var(--content-padding)',
				'content-slide': 'var( --content-slide)',
      },
			screens: {
				print: { raw: 'print' },
				screen: { raw: 'screen' },
			},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
					...colors.yellow,
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
					...colors.gray,
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			animation: {
        meteor: "meteor 5s linear infinite",
				flicker: "flicker 10s infinite ease-in-out",
				grow: "grow 15s infinite ease-in-out",
				heartbeat: "heartbeat 2.5s infinite ease-in-out",
				'rotate-around': "rotate-around 25s infinite ease-in-out",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: '1' },
          "70%": { opacity: '1' },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: '0',
          },
        },
				flicker: {
					"0%": { opacity: '0.15' },
          "50%": { opacity: '1.0' },
          "100%": { opacity: '0.15' },
				},
				grow: {
					"0%": { transform: 'scale(1.0)' },
          "50%": { transform: 'scale(1.15)' },
          "100%": { transform: 'scale(1.0)' },
				},
				heartbeat: {
					"0%": { transform: "scale(1)" },
					"25%": { transform: "scale(1.1)" },
					"50%": { transform: "scale(1)" },
					"75%": { transform: "scale(0.9)" },
					"100%": { transform: "scale(1)" }
				},
				'rotate-around': {
					"0%": { transform: 'rotate(0deg)' },
          "100%": { transform: 'rotate(360deg)' },
				}
      },
  	},
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
