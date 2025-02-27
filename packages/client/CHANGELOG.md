# sigstore

## 2.0.0

### Major Changes

- 829e123: Replaces the exported `sigstore` object with individual functions/types
- 4455f7f: Remove TUF helper functions (please use `@sigstore/tuf` package instead)
- d5060c0: Removes `oidcIssuer`, `oidcClient`, `oidcClientSecret`, and `oidcRedirectURL` from the options for the `sign` and `attest` functions. The OAuth identity provider that was associated with these options has been relocated to the `@sigstore/cli` package.
- d0053a3: Drop node 14 support
- 3bd0fbb: Removes `signer` from the options for the `sign` and `attest` functions (see the `@sigstore/sign` package if you require something other than Fulcio-style keyless signing)
- e36bbfa: Removes the legacy CLI (please use the `@sigstore/cli` package instead)
- 3bd0fbb: Remove `sigstore-utils` object from public interface

### Patch Changes

- 4e49006: Bump @tufjs/repo-mock from 1.4.0 to 2.0.0
- 06ea684: Bump @sigstore/protobuf-specs from 0.2.0 to 0.2.1
- Updated dependencies [4e49006]
- Updated dependencies [06ea684]
- Updated dependencies [06ea684]
- Updated dependencies [06ea684]
- Updated dependencies [d0053a3]
- Updated dependencies [d0053a3]
- Updated dependencies [3bc1817]
  - @sigstore/tuf@2.0.0
  - @sigstore/sign@2.0.0
  - @sigstore/bundle@2.0.0

## 1.9.0

### Minor Changes

- 75ba6cd: Integrate `@sigstore/sign` package
- e44f05c: Use bundle construction helpers from `@sigstore/bundle` package

### Patch Changes

- 9b8c140: Fix bug in inclusion proof verification
- Updated dependencies [fe31654]
- Updated dependencies [5de42a0]
- Updated dependencies [84eee0b]
- Updated dependencies [abcebbf]
  - @sigstore/sign@1.0.0
  - @sigstore/bundle@1.1.0

## 1.8.0

### Minor Changes

- f1b8bad: Support for verifying v0.2 Sigstore bundles that contain inclusion proofs from Rekor
- d9b1540: Integrate @sigstore/bundle package

### Patch Changes

- e0c16ec: Bump @sigstore/protobuf-specs from 0.1.0 to 0.2.0
- 6abe9ec: Fix bug when setting `tlogThreshold`/`ctLogThreshold` verification options to 0
- Updated dependencies [e0c16ec]
- Updated dependencies [f1b8bad]
- Updated dependencies [a388e25]
- Updated dependencies [e0c16ec]
- Updated dependencies [2a5f500]
- Updated dependencies [2a869ba]
  - @sigstore/bundle@1.0.0
  - @sigstore/tuf@1.0.3

## 1.7.0

### Minor Changes

- f374dd3: Include transparency log inclusion proof in Sigstore bundle
- fbfb315: Exports new `createVerifier` function

### Patch Changes

- bd1e1e1: Internal refactoring of Typescript types
- Updated dependencies [b97be71]
  - @sigstore/tuf@1.0.1

## 1.6.0

### Minor Changes

- 5ea8b63: Adds a new `identityProvider` config option for the `sign`/`attest` functions
- 16de8c7: Support for verifying Rekor entries w/ the new `dsse` entry type

### Patch Changes

- 4fdf826: Consume TUF client from `@sigstore/tuf` package
- f72e2b2: Consume Rekor API types from `@sigstore/rekor-types` package
- 84fd931: Export `IdentityProvider` interface
- Updated dependencies [29b88a3]
- Updated dependencies [3e770f0]
  - @sigstore/tuf@1.0.0

## 1.5.2

### Patch Changes

- 2f89e43: Update Fulcio client to handle responses with detached SCTs

## 1.5.1

### Patch Changes

- cab068e: Propagate `retry`/`timeout` options to the Timestamp Authority client

## 1.5.0

### Minor Changes

- f4c677e: Generated bundle excludes Fulcio root and intermediate certificates
- 5ca42a0: New `tsaServerURL` option for requesting a timestamp from a Timestamp Authority API
- 4e715c9: Exposes a new `tuf.client` function which returns a client for retrieving targets from the Sigstore TUF repository.
- 4b97516: New `tlogUpload` option for `sign` and `attest` to control signature uploads to the transparency log
- f927296: New `retry` and `timeout` options to control fetch behavior when errors occur

### Patch Changes

- 2e5e733: Certificate chain verification enforces pathlen constraint for CA certs
- 3205ce9: Updates certificate verification to ignore all but the first certificate present in the bundle
- bb2006b: Updating embedded Sigstore TUF root to v7

## 1.4.0

### Minor Changes

- 99093bb: add specific errors codes for `InternalError`s
- 99093bb: export error classes

## 1.3.2

### Patch Changes

- 6ba4fd1: Print the rekor search entry when running the `sigstore attest` command

## 1.3.1

### Patch Changes

- d2d0702: Update CLI sign cmd to output a link to search.sigstore.dev

## 1.3.0

### Minor Changes

- c2e3dd5: Add support for verification of certificate extension values encoded as UTF8String
- 6fd6e22: Exposes a new `tuf.getTarget` function to retrieve targets from the Sigstore TUF repository
- da0bfd7: Added new token provider for looking up OIDC tokens in the SIGSTORE_ID_TOKEN environment variable.

### Patch Changes

- 9dbb26d: Use CDN-backend endpoint to fetch TUF root material
- 341b7bd: Update dependency - tuf-js@1.1.3

## 1.2.0

### Minor Changes

- 54d6de4: Adds new `redirectURL` config option when signing with an OAuth identity provider

### Patch Changes

- 8b9375f: Update to tuf-js@1.1.2
- 8f9f994: Use the Fulcio v2 API for requesting signing certificates

## 1.1.1

### Patch Changes

- 62de8cd: Unbundles the @sigstore/protobuf-specs dependency

## 1.1.0

### Minor Changes

- 49709fc: Exposes new `tufMirrorURL` and `tufRootPath` options to the `verify` function
- 49709fc: Relocates the TUF cache to a platform-specific app data directory

### Patch Changes

- 6b75981: Consume the trusted_root.json target from the Sigstore TUF repository
