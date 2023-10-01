import { CurlGenerator } from 'curl-generator';
import toast from 'react-hot-toast';
import { HiOutlineClipboardCopy } from 'react-icons/hi';

import { IconButton } from '@/components';
import { Trace } from '@/types';
import { cloneHeaders, flatMapHeaders, safeParseJson } from '@/utils';

type CopyAsCurlButtonProps = {
  trace: Trace;
};

export default function CopyAsCurlButton({ trace }: CopyAsCurlButtonProps) {
  if (!trace?.http) return null;
  if (trace.http.method === 'OPTIONS') return null;

  async function copyAsCurl() {
    const headers = flatMapHeaders(cloneHeaders(trace.http!.requestHeaders, true));
    const body = safeParseJson(trace.http!.requestBody) ?? null;

    const curlSnippet = CurlGenerator({
      method: trace.http!.method as any,
      url: trace.http!.url,
      headers,
      body,
    });

    await navigator.clipboard.writeText(curlSnippet);

    toast.success('cURL snippet written to clipboard', {
      position: 'top-right',
    });
  }

  return (
    <IconButton type="standard" Icon={HiOutlineClipboardCopy} onClick={async () => await copyAsCurl()}>
      Copy as cURL snippet
    </IconButton>
  );
}
