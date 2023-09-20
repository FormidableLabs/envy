import usePlatform from '@/hooks/usePlatform';

jest.mock('@/hooks/usePlatform');

export function setUsePlatformData(platform: 'mac' | 'windows') {
  switch (platform) {
    case 'mac':
      jest.mocked(usePlatform).mockReturnValue({
        isMac: true,
        isWindows: false,
        specialKey: '⌘',
      });
      break;
    case 'windows':
      jest.mocked(usePlatform).mockReturnValue({
        isMac: false,
        isWindows: true,
        specialKey: 'CTRL+',
      });
      break;
  }
}
