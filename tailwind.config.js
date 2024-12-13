module.exports = {
	content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
	safelist: [
		'bg-background',
		'text-foreground',
		'border-border',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				border: 'var(--border)',
			},
		},
	},
	plugins: [],
};

