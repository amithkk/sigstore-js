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
import { bundleFromJSON } from '@sigstore/bundle';
import { VerificationError } from '../error';
import * as sigstore from '../types/sigstore';
import { Verifier } from '../verify';
import bundles from './__fixtures__/bundles/v01';
import { trustedRoot } from './__fixtures__/trust';

describe('Verifier', () => {
  const options: sigstore.RequiredArtifactVerificationOptions = {
    ctlogOptions: {
      disable: false,
      threshold: 1,
      detachedSct: false,
    },
    tlogOptions: {
      disable: false,
      threshold: 1,
      performOnlineVerification: false,
    },
  };

  const subject = new Verifier(trustedRoot);

  describe('#verify', () => {
    describe('when bundle type is messageSignature', () => {
      const payload = bundles.signature.artifact;

      describe('when the key comes from the bundle', () => {
        const bundle = bundleFromJSON(bundles.signature.valid.withSigningCert);

        describe('when the signature and the cert match', () => {
          it('does NOT throw an error', () => {
            expect(() =>
              subject.verify(bundle, options, payload)
            ).not.toThrow();
          });
        });

        describe('when the signature and the cert do NOT match', () => {
          it('throws an error', () => {
            expect(() =>
              subject.verify(bundle, options, Buffer.from(''))
            ).toThrow(VerificationError);
          });
        });

        describe('when original artifact is missing', () => {
          it('throws an error', () => {
            expect(() => subject.verify(bundle, options, undefined)).toThrow(
              VerificationError
            );
          });
        });

        describe('when the trusted signers is malformed', () => {
          const optionsWithSigners: sigstore.RequiredArtifactVerificationOptions =
            {
              ...options,
              signers: {
                $case: 'publicKeys',
                publicKeys: {
                  publicKeys: [],
                },
              },
            };

          it('throws an error', () => {
            expect(() =>
              subject.verify(bundle, optionsWithSigners, payload)
            ).toThrow(VerificationError);
          });
        });
      });

      describe('when the key comes from the key selector callback', () => {
        const subject = new Verifier(
          trustedRoot,
          () => bundles.signature.publicKey
        );
        const bundle = bundleFromJSON(bundles.signature.valid.withPublicKey);

        describe('when the key is available', () => {
          describe('when the signature and the cert match', () => {
            it('does NOT throw an error', () => {
              expect(() =>
                subject.verify(bundle, options, payload)
              ).not.toThrow();
            });
          });

          describe('when the payload digest does not match the value in the bundle', () => {
            it('throws an error', () => {
              expect(() =>
                subject.verify(bundle, options, Buffer.from(''))
              ).toThrow(VerificationError);
            });
          });

          describe('when the bundle signature is incorrect', () => {
            const bundle = bundleFromJSON(
              bundles.signature.invalid.badSignature
            );

            it('throws an error', () => {
              expect(() => subject.verify(bundle, options, payload)).toThrow(
                VerificationError
              );
            });
          });
        });

        describe('when the key is NOT available', () => {
          const subject = new Verifier(trustedRoot, undefined);

          it('throws an error', () => {
            expect(() => subject.verify(bundle, options, payload)).toThrow(
              VerificationError
            );
          });
        });
      });
    });

    describe('when bundle type is dsseEnvelope', () => {
      describe('when the key comes from the bundle', () => {
        describe('when the signature and the cert match', () => {
          const bundle = bundleFromJSON(bundles.dsse.valid.withSigningCert);

          it('does NOT throw an error', () => {
            expect(() => subject.verify(bundle, options)).not.toThrow();
          });
        });

        describe('when the signature and the cert do NOT match', () => {
          const bundle = bundleFromJSON(bundles.dsse.invalid.badSignature);
          it('throws an error', () => {
            expect(() => subject.verify(bundle, options)).toThrow(
              VerificationError
            );
          });
        });

        describe('when there are no tlog entries in the bundle', () => {
          const bundle = bundleFromJSON(bundles.dsse.valid.withNoTLogEntries);

          describe('when tlog verification is disabled', () => {
            const opts: sigstore.RequiredArtifactVerificationOptions = {
              ...options,
              tlogOptions: {
                disable: true,
                threshold: 0,
                performOnlineVerification: false,
              },
            };

            it('does NOT throw an error', () => {
              expect(() => subject.verify(bundle, opts)).not.toThrow();
            });
          });

          describe('when tlog verification is enabled', () => {
            describe('when tlog threshold is 0', () => {
              const opts: sigstore.RequiredArtifactVerificationOptions = {
                ...options,
                tlogOptions: {
                  disable: false,
                  threshold: 0,
                  performOnlineVerification: false,
                },
              };

              it('does NOT throw an error', () => {
                expect(() => subject.verify(bundle, opts)).not.toThrow();
              });
            });

            describe('when tlog threshold is greater than 0', () => {
              const opts: sigstore.RequiredArtifactVerificationOptions = {
                ...options,
                tlogOptions: {
                  disable: false,
                  threshold: 1,
                  performOnlineVerification: false,
                },
              };

              it('throws an error', () => {
                expect(() => subject.verify(bundle, opts)).toThrow(
                  VerificationError
                );
              });
            });
          });
        });
      });

      describe('when the key comes from the key selector callback', () => {
        const subject = new Verifier(trustedRoot, () => bundles.dsse.publicKey);

        describe('when the signature and the cert match', () => {
          const bundle = bundleFromJSON(bundles.dsse.valid.withPublicKey);

          it('does NOT throw an error', () => {
            expect(() => subject.verify(bundle, options)).not.toThrow();
          });
        });

        describe('when the signature and the cert do NOT match', () => {
          const bundle = bundleFromJSON(bundles.dsse.invalid.badSignature);

          it('throws an error', () => {
            expect(() => subject.verify(bundle, options)).toThrow(
              VerificationError
            );
          });
        });

        describe('when the trusted key is malformed', () => {
          const subject = new Verifier(trustedRoot, () => Buffer.from(''));
          const bundle = bundleFromJSON(bundles.dsse.valid.withPublicKey);

          it('throws an error', () => {
            expect(() => subject.verify(bundle, options)).toThrow(
              VerificationError
            );
          });
        });
      });
    });
  });
});
