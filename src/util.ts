const BASE64_ENCODING = 'base64';
const UTF8_ENCODING = 'utf-8';

export function base64Decode(str: string): string {
  return Buffer.from(str, BASE64_ENCODING).toString(UTF8_ENCODING);
}

export function base64Encode(str: string): string {
  return Buffer.from(str, UTF8_ENCODING).toString(BASE64_ENCODING);
}

export function extractJWTSubject(jwt: string): string {
  const parts = jwt.split('.', 3);
  const payload = JSON.parse(base64Decode(parts[1]));

  switch (payload.iss) {
    case 'https://accounts.google.com':
    case 'https://oauth2.sigstore.dev/auth':
      return payload.email;
    default:
      return payload.sub;
  }
}

// Implementation of Promise.any (not available until Node v15).
// We're basically inverting the logic of Promise.all and taking advantage
// of the fact that Promise.all will return early on the first rejection.
// By reversing the resolve/reject logic we can use this to return early
// on the first resolved promise.
export const promiseAny = async <T>(
  values: Iterable<PromiseLike<T>>
): Promise<T> => {
  return Promise.all<T>(
    [...values].map(
      (promise) =>
        new Promise((resolve, reject) => promise.then(reject, resolve))
    )
  ).then(
    (errors) => Promise.reject(errors),
    (value) => Promise.resolve<T>(value)
  );
};
