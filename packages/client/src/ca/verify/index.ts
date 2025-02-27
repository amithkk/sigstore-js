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
import * as sigstore from '../../types/sigstore';
import { verifyChain } from './chain';
import { verifySCTs } from './sct';
import { verifySignerIdentity } from './signer';

import type { BundleWithCertificateChain } from '@sigstore/bundle';

export function verifySigningCertificate(
  bundle: BundleWithCertificateChain,
  trustedRoot: sigstore.TrustedRoot,
  options: sigstore.CAArtifactVerificationOptions
) {
  // Check that a trusted certificate chain can be found for the signing
  // certificate in the bundle. Only the first certificate in the bundle's
  // chain is used -- everything else must come from the trusted root.
  const trustedChain = verifyChain(
    bundle.verificationMaterial.content.x509CertificateChain.certificates[0],
    trustedRoot.certificateAuthorities
  );

  // Unless disabled, verify the SCTs in the signing certificate
  if (options.ctlogOptions.disable === false) {
    verifySCTs(trustedChain, trustedRoot.ctlogs, options.ctlogOptions);
  }

  // Verify the signing certificate against the provided identities
  // if provided
  if (options.signers) {
    verifySignerIdentity(
      trustedChain[0],
      options.signers.certificateIdentities
    );
  }
}
