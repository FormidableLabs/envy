import { ChevronDown, Code2, MoreHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button, Code, CodeDisplay } from '@/components';
import { tw } from '@/utils';

enum TokenType {
  JWT = 0,
  BasicAuth = 1,
}

enum TokenState {
  Minimal = 0,
  Expanded = 1,
  Decoded = 2,
}

type AuthorizationProps = {
  value: string | null;
};

export default function Authorization({ value }: AuthorizationProps) {
  const [tokenState, setTokenState] = useState(TokenState.Minimal);
  const [type, setType] = useState('');
  const [token, setToken] = useState<React.ReactNode>('');
  const [decodedToken, setDecodedToken] = useState<React.ReactNode>('');

  useEffect(() => {
    if (!value) return;

    const jwtBearerRegex = /^Bearer ([\w-]+\.[\w-]+\.[\w-]+)$/;
    const otherBearerRegex = /^Bearer (.*)$/;
    const basicBase64Regex = /^Basic ([\w=]+)$/;

    if (jwtBearerRegex.test(value)) {
      const token = jwtBearerRegex.exec(value)![1];
      setType('Bearer');
      setToken(token);
      decodeToken(TokenType.JWT, token);
    } else if (otherBearerRegex.test(value)) {
      const token = otherBearerRegex.exec(value)?.[1];
      setType('Bearer');
      setToken(token);
    } else if (basicBase64Regex.test(value)) {
      const token = basicBase64Regex.exec(value)![1];
      setType('Basic');
      setToken(token);
      decodeToken(TokenType.BasicAuth, token);
    }
  }, [value]);

  if (!value) return null;

  function decodeToken(type: TokenType, token: string) {
    let decoded = '';

    if (type === TokenType.JWT) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      decoded = jsonPayload;
    } else if (type === TokenType.BasicAuth) {
      const [un, pw] = atob(token).split(':');
      decoded = JSON.stringify({ username: un, password: pw });
    }

    setDecodedToken(<CodeDisplay contentType="application/json" data={decoded} className="py-4" />);
  }

  return (
    <div className="flex flex-col-reverse">
      {(() => {
        switch (tokenState) {
          case TokenState.Minimal:
            return (
              <div
                data-test-id="token-minimal-view"
                className="flex hover:bg-apple-200 rounded-sm cursor-pointer mr-4"
                onClick={() => setTokenState(TokenState.Expanded)}
              >
                <div className="clamp">
                  {type} {token}
                </div>
                <div className="flex items-center justify-end ml-auto">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            );
          case TokenState.Expanded:
            return <Code data-test-id="token-expanded-view">{`${type} ${token}`}</Code>;
          case TokenState.Decoded:
            return (
              <div data-test-id="token-decoded-view" className="bg-manatee-100">
                {decodedToken}
              </div>
            );
        }
      })()}
      {tokenState !== TokenState.Minimal && (
        <div className={tw('flex flex-row gap-2 bg-manatee-100 px-4 pt-4')}>
          <>
            <Button
              data-test-id="token-expanded-button"
              Icon={MoreHorizontal}
              title="View full token"
              size="small"
              selected={tokenState === TokenState.Expanded}
              onClick={() => setTokenState(TokenState.Expanded)}
            >
              Full token
            </Button>
            {decodedToken && (
              <Button
                data-test-id="token-decoded-button"
                Icon={Code2}
                title="Decode token"
                size="small"
                selected={tokenState === TokenState.Decoded}
                onClick={() => setTokenState(TokenState.Decoded)}
              >
                Decoded token
              </Button>
            )}
            <Button
              data-test-id="token-minimal-button"
              Icon={X}
              title="Collapse"
              className="ml-auto"
              border="none"
              size="small"
              onClick={() => setTokenState(TokenState.Minimal)}
            />
          </>
        </div>
      )}
    </div>
  );
}
