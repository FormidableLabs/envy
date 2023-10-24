import { MoonStar, SunMedium } from 'lucide-react';
import { useState } from 'react';

import IconButton from './IconButton';

export default function DarkModeToggle() {
  const initialTheme = localStorage.theme === 'dark';
  const [useDarkMode, setUseDarkMode] = useState(initialTheme);

  const handleCheckboxChange = () => {
    const shouldSetDarkMode = !useDarkMode;

    if (shouldSetDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }

    setUseDarkMode(shouldSetDarkMode);
  };

  const Icon = useDarkMode ? MoonStar : SunMedium;

  return <IconButton Icon={Icon} onClick={handleCheckboxChange} role="toggle" />;
}
