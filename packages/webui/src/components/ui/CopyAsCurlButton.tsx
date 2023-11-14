import { safeParseJson } from '@envyjs/core';
import { CurlGenerator } from 'curl-generator';
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components';
import { Trace } from '@/types';
import { cloneHeaders, flatMapHeaders } from '@/utils';

type CopyAsCurlButtonProps = {
  trace: Trace;
};

export default function CopyAsCurlButton({ trace, ...props }: CopyAsCurlButtonProps) {
  async function copyAsCurl() {
    const headers = flatMapHeaders(cloneHeaders(trace.http!.requestHeaders, true));
    const body = safeParseJson(trace.http!.requestBody).value ?? null;

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

  return <Button {...props} Icon={ClipboardCopy} border="none" onClick={async () => await copyAsCurl()} />;
}
