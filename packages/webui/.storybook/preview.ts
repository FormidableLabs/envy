import '../src/styles/base.css';

import { withThemeByClassName } from '@storybook/addon-styling';

export const decorators = [
	withThemeByClassName({
		themes: {
			light: 'light',
			dark: 'dark',
		},
		defaultTheme: 'light',
	}),
];
