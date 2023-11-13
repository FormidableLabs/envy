import { ChevronDown, ChevronUp, Code2, MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Code, CodeDisplay, IconButton } from '@/components';
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

    setDecodedToken(<CodeDisplay contentType="application/json" data={decoded} />);
  }

  return (
    <div className="flex flex-col-reverse">
      {(() => {
        switch (tokenState) {
          case TokenState.Minimal:
            return (
              <div
                data-test-id="token-minimal-view"
                className="flex hover:bg-gray-100 rounded-sm cursor-pointer"
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
              <div data-test-id="token-decoded-view" className="h-[300px]">
                {decodedToken}
              </div>
            );
        }
      })()}
      {tokenState !== TokenState.Minimal && (
        <div className={tw('flex flex-row gap-2 bg-gray-200 px-4 pt-4')}>
          <>
            <IconButton
              data-test-id="token-expanded-button"
              Icon={MoreHorizontal}
              title="View full token"
              className={tw(tokenState === TokenState.Expanded && 'bg-neutral')}
              disabled={tokenState === TokenState.Expanded}
              onClick={() => setTokenState(TokenState.Expanded)}
            >
              Full token
            </IconButton>
            {decodedToken && (
              <IconButton
                data-test-id="token-decoded-button"
                Icon={Code2}
                title="Decode token"
                className={tw(tokenState === TokenState.Decoded && 'bg-neutral')}
                onClick={() => setTokenState(TokenState.Decoded)}
              >
                Decoded token
              </IconButton>
            )}
            <IconButton
              data-test-id="token-minimal-button"
              Icon={ChevronUp}
              title="Collapse"
              className="ml-auto px-0"
              onClick={() => setTokenState(TokenState.Minimal)}
            />
          </>
        </div>
      )}
    </div>
  );
}
