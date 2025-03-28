/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";
import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
			fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)", ...fontFamily.serif],
				mono: ["var(--font-mono)", ...fontFamily.mono],
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
        "meteor": "meteor 5s linear infinite",
				"flicker": "flicker 10s infinite ease-in-out",
				"grow": "grow 15s infinite ease-in-out",
				"heartbeat": "heartbeat 2.5s infinite ease-in-out",
				"rotate-around": "rotate-around 25s infinite ease-in-out",
      },
      keyframes: {
        "meteor": {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: '1' },
          "70%": { opacity: '1' },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: '0',
          },
        },
				"flicker": {
					"0%": { opacity: '0.15' },
          "50%": { opacity: '1.0' },
          "100%": { opacity: '0.15' },
				},
				"grow": {
					"0%": { transform: 'scale(1.0)' },
          "50%": { transform: 'scale(1.15)' },
          "100%": { transform: 'scale(1.0)' },
				},
				"heartbeat": {
					"0%": { transform: "scale(1)" },
					"25%": { transform: "scale(1.1)" },
					"50%": { transform: "scale(1)" },
					"75%": { transform: "scale(0.9)" },
					"100%": { transform: "scale(1)" }
				},
				"rotate-around": {
					"0%": { transform: 'rotate(0deg)' },
          "100%": { transform: 'rotate(360deg)' },
				}
      },

			typography: () => ({
        custom: {
          css: {
						'--tw-prose-body': colors.stone[900],
						'--tw-prose-headings': colors.stone[900],
						'--tw-prose-lead': colors.stone[600],
						'--tw-prose-links': colors.stone[900],
						'--tw-prose-bold': colors.stone[900],
						'--tw-prose-counters': colors.stone[500],
						'--tw-prose-bullets': colors.stone[300],
						'--tw-prose-hr': colors.stone[200],
						'--tw-prose-quotes': colors.stone[900],
						'--tw-prose-quote-borders': colors.stone[200],
						'--tw-prose-captions': colors.stone[500],
						'--tw-prose-kbd': colors.stone[900],
						'--tw-prose-kbd-shadows': hexToRgb(colors.stone[900]),
						'--tw-prose-code': colors.stone[900],
						'--tw-prose-pre-code': colors.stone[200],
						'--tw-prose-pre-bg': colors.stone[800],
						'--tw-prose-th-borders': colors.stone[300],
						'--tw-prose-td-borders': colors.stone[200],
						'--tw-prose-invert-body': colors.stone[100],
						'--tw-prose-invert-headings': colors.white,
						'--tw-prose-invert-lead': colors.stone[400],
						'--tw-prose-invert-links': colors.white,
						'--tw-prose-invert-bold': colors.white,
						'--tw-prose-invert-counters': colors.stone[400],
						'--tw-prose-invert-bullets': colors.stone[600],
						'--tw-prose-invert-hr': colors.stone[700],
						'--tw-prose-invert-quotes': colors.stone[100],
						'--tw-prose-invert-quote-borders': colors.stone[700],
						'--tw-prose-invert-captions': colors.stone[400],
						'--tw-prose-invert-kbd': colors.white,
						'--tw-prose-invert-kbd-shadows': hexToRgb(colors.white),
						'--tw-prose-invert-code': colors.white,
						'--tw-prose-invert-pre-code': colors.stone[300],
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': colors.stone[600],
						'--tw-prose-invert-td-borders': colors.stone[700],
          },
        },
      }),
  	},
  },
  plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
	],
};
export default config;


/******************************************************************************
 * Utils
 */

const hexToRgb = (hex: string) => {
  hex = hex.replace('#', '')
  hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}