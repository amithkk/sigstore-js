/*
Copyright 2023 The Sigstore Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { fulcioHandler, initializeCA, initializeCTLog } from './fulcio';
import { mock } from './mock';
import { initializeTLog, rekorHandler } from './rekor';
import { initializeTSA, tsaHandler } from './timestamp';

const DEFAULT_FULCIO_URL = 'https://fulcio.sigstore.dev';
const DEFAULT_REKOR_URL = 'https://rekor.sigstore.dev';
const DEFAULT_TSA_URL = 'https://timestamp.sigstore.dev';

interface FulcioOptions {
  baseURL?: string;
  strict?: boolean;
}

interface RekorOptions {
  baseURL?: string;
  strict?: boolean;
}

interface TSAOptions {
  baseURL?: string;
  strict?: boolean;
}

export async function mockFulcio(options: FulcioOptions = {}) {
  const url = options.baseURL || DEFAULT_FULCIO_URL;
  const strict = options.strict ?? true;
  const handler = await initializeCTLog()
    .then((ctlog) => initializeCA(ctlog))
    .then((ca) => fulcioHandler(ca, { strict }));
  mock(url, handler);
}

export async function mockRekor(options: RekorOptions = {}) {
  const url = options.baseURL || DEFAULT_REKOR_URL;
  const strict = options.strict ?? true;
  const handler = await initializeTLog(url).then((tlog) =>
    rekorHandler(tlog, { strict })
  );
  mock(url, handler);
}

export async function mockTSA(options: TSAOptions = {}) {
  const url = options.baseURL || DEFAULT_TSA_URL;
  const strict = options.strict ?? true;
  const handler = await initializeTSA().then((tsa) =>
    tsaHandler(tsa, { strict })
  );
  mock(url, handler);
}

export type { HandlerFn } from './shared.types';
export {
  fulcioHandler,
  initializeCA,
  initializeCTLog,
  initializeTLog,
  initializeTSA,
  rekorHandler,
  tsaHandler,
};
