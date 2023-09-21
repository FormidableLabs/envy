import React, { useEffect, useState } from 'react';
import { HiChevronDown, HiChevronUp, HiCode, HiDotsHorizontal } from 'react-icons/hi';

import { Code, IconButton, JsonDisplay } from '@/components/ui';
import { safeParseJson, tw } from '@/utils';

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
    let decoded;

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

      decoded = safeParseJson(jsonPayload);
    } else if (type === TokenType.BasicAuth) {
      const [un, pw] = atob(token).split(':');
      decoded = { username: un, password: pw };
    }

    setDecodedToken(<JsonDisplay>{decoded}</JsonDisplay>);
  }

  return (
    <span className="flex flex-col-reverse">
      <span className="flex self-start w-full">
        {(() => {
          switch (tokenState) {
            case TokenState.Minimal:
              return (
                <span
                  data-test-id="token-minimal-view"
                  className="btn-inline"
                  onClick={() => setTokenState(TokenState.Expanded)}
                >
                  <span className="flex-1 self-start h-6 overflow-y-hidden">
                    {type} {token}
                  </span>
                  <HiChevronDown className="flex-0 w-6 h-6" />
                </span>
              );
            case TokenState.Expanded:
              return <Code data-test-id="token-expanded-view">{`${type} ${token}`}</Code>;
            case TokenState.Decoded:
              return <div data-test-id="token-decoded-view">{decodedToken}</div>;
          }
        })()}
      </span>
      {tokenState !== TokenState.Minimal && (
        <span className={tw('flex flex-row gap-2 bg-slate-100 px-4 pt-4')}>
          <>
            <IconButton
              data-test-id="token-expanded-button"
              short
              Icon={HiDotsHorizontal}
              title="View full token"
              className={tw(tokenState === TokenState.Expanded && 'btn-selected')}
              disabled={tokenState === TokenState.Expanded}
              onClick={() => setTokenState(TokenState.Expanded)}
            >
              Full token
            </IconButton>
            {decodedToken && (
              <IconButton
                data-test-id="token-decoded-button"
                short
                Icon={HiCode}
                title="Decode token"
                className={tw(tokenState === TokenState.Decoded && 'btn-selected')}
                onClick={() => setTokenState(TokenState.Decoded)}
              >
                Decoded token
              </IconButton>
            )}
            <IconButton
              data-test-id="token-minimal-button"
              short
              Icon={HiChevronUp}
              title="Collapse"
              className="ml-auto px-0"
              onClick={() => setTokenState(TokenState.Minimal)}
            />
          </>
        </span>
      )}
    </span>
  );
}
