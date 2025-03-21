/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
  		},
  		colors: {
  			primary: {
  				'100': 'hsl(240, 19%, 95%)',
  				'150': 'hsl(240, 19%, 90%)',
  				'200': 'hsl(236, 19%, 85%)',
  				'300': 'hsl(235, 20%, 80%)',
  				'400': 'hsl(236, 19%, 75%)',
  				'500': 'hsl(236, 19%, 70%)',
  				'600': 'hsl(240, 18%, 65%)',
  				'700': 'hsl(240, 17%, 60%)',
  				'800': 'hsl(240, 17%, 55%)',
  				'850': 'hsl(240, 18%, 50%)',
  				'900': 'hsl(240, 17%, 45%)',
  				'950': 'hsl(240, 17%, 40%)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			primarydark: {
  				'50': 'hsl(240, 17%, 35%)',
  				'100': 'hsl(240, 17%, 30%)',
  				'200': 'hsl(240, 17%, 27%)',
  				'300': 'hsl(240, 17%, 24%)',
  				'400': 'hsl(240, 17%, 21%)',
  				'500': 'hsl(240, 17%, 19%)',
  				'600': 'hsl(240, 17%, 16%)',
  				'650': 'hsl(240, 17%, 14%)',
  				'700': 'hsl(240, 18%, 13%)',
  				'800': 'hsl(240, 17%, 10%)',
  				'900': 'hsl(240, 17%, 8%)'
  			},
  			secondary: {
  				'100': 'hsl(347, 40%, 91%)',
  				'200': 'hsl(344, 44%, 86%)',
  				'300': 'hsl(344, 46%, 82%)',
  				'400': 'hsl(343, 49%, 78%)',
  				'500': 'hsl(342, 50%, 73%)',
  				'600': 'hsl(341, 51%, 70%)',
  				'700': 'hsl(341, 52%, 65%)',
  				'800': 'hsl(339, 53%, 61%)',
  				'850': 'hsl(339, 46%, 55%)',
  				'900': 'hsl(339, 37%, 45%)',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			ecoblue: {
  				'100': 'hsl(210, 50%, 95%)',
  				'200': 'hsl(211, 51%, 83%)',
  				'300': 'hsl(210, 49%, 72%)',
  				'400': 'hsl(210, 50%, 61%)',
  				'500': 'hsl(210, 50%, 50%)',
  				'600': 'hsl(210, 50%, 39%)',
  				'700': 'hsl(210, 49%, 28%)',
  				'800': 'hsl(211, 51%, 17%)',
  				'850': 'hsl(211, 51%, 10%)',
  				'900': 'hsl(210, 50%, 5%)'
  			},
  			ecoyellow: {
  				'100': 'hsl(34, 88%, 95%)',
  				'200': 'hsl(34, 88%, 83%)',
  				'300': 'hsl(34, 88%, 72%)',
  				'400': 'hsl(34, 88%, 61%)',
  				'500': 'hsl(34, 88%, 50%)',
  				'600': 'hsl(34, 88%, 39%)',
  				'700': 'hsl(34, 88%, 28%)',
  				'800': 'hsl(34, 88%, 17%)',
  				'900': 'hsl(34, 88%, 11%)'
  			},
  			ecogreen: {
  				'100': 'hsl(120, 36%, 95%)',
  				'200': 'hsl(120, 34%, 83%)',
  				'300': 'hsl(120, 34%, 72%)',
  				'400': 'hsl(120, 34%, 61%)',
  				'500': 'hsl(120, 34%, 50%)',
  				'600': 'hsl(120, 34%, 39%)',
  				'700': 'hsl(120, 34%, 28%)',
  				'800': 'hsl(120, 34%, 17%)',
  				'900': 'hsl(120, 36%, 5%)'
  			},
  			ecored: {
  				'100': 'hsl(345, 100%, 95%)',
  				'200': 'hsl(345, 100%, 83%)',
  				'300': 'hsl(345, 100%, 72%)',
  				'400': 'hsl(345, 100%, 61%)',
  				'500': 'hsl(345, 100%, 50%)',
  				'600': 'hsl(345, 100%, 39%)',
  				'700': 'hsl(346, 100%, 28%)',
  				'800': 'hsl(345, 100%, 17%)',
  				'900': 'hsl(345, 100%, 10%)'
  			},
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
  		
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
