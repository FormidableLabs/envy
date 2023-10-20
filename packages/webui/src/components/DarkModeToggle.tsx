import { useState } from 'react';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

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

  return (
    <div className="flex flex-col justify-center">
      <input
        type="checkbox"
        name="light-switch"
        className="light-switch sr-only"
        checked={useDarkMode}
        onChange={handleCheckboxChange}
      />
      <label
        className="relative cursor-pointer p-2.5 ring-1 ring-inset ring-primary text-secondary rounded-md shadow-sm"
        htmlFor="light-switch"
        onClick={handleCheckboxChange}
        role="toggle"
      >
        <HiOutlineSun className="dark:hidden" />
        <HiOutlineMoon className="hidden dark:block" />

        <span className="sr-only">Switch to light / dark version</span>
      </label>
    </div>
  );
}
