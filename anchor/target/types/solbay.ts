/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solbay.json`.
 */
export type Solbay = {
  address: 'DsEJ8Xoffs9GSDhzPV3iUi7LskYSJxUKfhgotnWbUpme';
  metadata: {
    name: 'solbay';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'login';
      discriminator: [25, 137, 95, 67, 72, 162, 93, 236];
      accounts: [
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'signer';
          signer: true;
        },
      ];
      args: [];
    },
  ];
};
