import { cleanup, render } from '@testing-library/react';

import { setUseApplicationData } from '@/testing/mockUseApplication';

import TraceRequestData from './TraceRequestData';

describe('TraceRequestData', () => {
  beforeEach(() => {
    setUseApplicationData({ selectedTraceId: undefined });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/" />);
  });

  describe('iconPath', () => {
    it('should render icon as image', () => {
      const { getByTestId } = render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/" />);

      const image = getByTestId('item-image');

      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src', 'icon.jpg');
    });

    it('should render system name as image alt text', () => {
      const { getByTestId } = render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/" />);

      const image = getByTestId('item-image');

      expect(image).toBeVisible();
      expect(image).toHaveAttribute('alt', 'Default');
    });
  });

  describe('hostName', () => {
    it('should not render host if `hostName` is not supplied', () => {
      const { queryByTestId } = render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/foo/bar" />);

      const host = queryByTestId('item-hostname');

      expect(host).not.toBeInTheDocument();
    });

    it('should render host if `hostName` is supplied', () => {
      const { getByTestId } = render(
        <TraceRequestData systemName="Default" iconPath="icon.jpg" hostName="www.example.com" path="/foo/bar" />,
      );

      const host = getByTestId('item-hostname');

      expect(host).toBeVisible();
      expect(host).toHaveTextContent('www.example.com');
    });

    it('should render host next to image', () => {
      const { getByTestId } = render(
        <TraceRequestData systemName="Default" iconPath="icon.jpg" hostName="www.example.com" path="/foo/bar" />,
      );

      const host = getByTestId('item-hostname');
      const image = getByTestId('item-image');

      expect(host.previousSibling).toBe(image);
    });
  });

  describe('path', () => {
    it('should render path', () => {
      const { getByTestId } = render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/foo/bar" />);

      const path = getByTestId('item-path');

      expect(path).toBeVisible();
      expect(path).toHaveTextContent('/foo/bar');
    });

    it('should render path next to image if `hostName` is not supplied', () => {
      const { getByTestId } = render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/foo/bar" />);

      const path = getByTestId('item-path');
      const image = getByTestId('item-image');

      expect(path.previousSibling).toBe(image);
    });

    it('should render path next to host if `hostName` is supplied', () => {
      const { getByTestId } = render(
        <TraceRequestData systemName="Default" iconPath="icon.jpg" hostName="www.example.com" path="/foo/bar" />,
      );

      const path = getByTestId('item-path');
      const host = getByTestId('item-hostname');

      expect(path.previousSibling).toBe(host);
    });
  });

  describe('data', () => {
    it('should not render data if `data` is not supplied', () => {
      const { queryByTestId } = render(<TraceRequestData systemName="Default" iconPath="icon.jpg" path="/foo/bar" />);

      const data = queryByTestId('item-data');

      expect(data).not.toBeInTheDocument();
    });

    it('should render data if `data` is supplied', () => {
      const { getByTestId } = render(
        <TraceRequestData
          systemName="Default"
          iconPath="icon.jpg"
          hostName="www.example.com"
          path="/foo/bar"
          data="This is some data"
        />,
      );

      const data = getByTestId('item-data');
      expect(data).toBeVisible();
      expect(data).toHaveTextContent('This is some data');
    });

    it('should render data after request detail', () => {
      const { getByTestId } = render(
        <TraceRequestData
          systemName="Default"
          iconPath="icon.jpg"
          hostName="www.example.com"
          path="/foo/bar"
          data="This is some data"
        />,
      );

      const data = getByTestId('item-data');
      const request = getByTestId('item-request');

      expect(data.previousSibling).toBe(request);
    });
  });
});
