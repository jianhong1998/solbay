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
      name: 'initEscrow';
      discriminator: [70, 46, 40, 23, 6, 11, 81, 139];
      accounts: [
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'escrowTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
      ];
      args: [];
    },
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
    {
      name: 'purchase';
      discriminator: [21, 93, 113, 154, 193, 160, 242, 168];
      accounts: [
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'buyer';
          writable: true;
          signer: true;
        },
        {
          name: 'seller';
        },
        {
          name: 'mint';
        },
        {
          name: 'order';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [111, 114, 100, 101, 114];
              },
              {
                kind: 'arg';
                path: 'orderId';
              },
              {
                kind: 'arg';
                path: 'platformCode';
              },
            ];
          };
        },
        {
          name: 'escrowTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
      ];
      args: [
        {
          name: 'orderId';
          type: 'string';
        },
        {
          name: 'platformCode';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'sellerTimeout';
          type: 'u64';
        },
        {
          name: 'remarks';
          type: 'string';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'order';
      discriminator: [134, 173, 223, 185, 77, 86, 28, 51];
    },
  ];
  types: [
    {
      name: 'order';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'isFundReleased';
            type: 'bool';
          },
          {
            name: 'sellerPubkey';
            type: 'pubkey';
          },
          {
            name: 'buyerPubkey';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'sellerShipOutTimeout';
            type: 'u64';
          },
          {
            name: 'fundReleaseTimeout';
            type: 'u64';
          },
          {
            name: 'tokenMintAddress';
            type: 'pubkey';
          },
          {
            name: 'platformCode';
            type: 'string';
          },
          {
            name: 'orderId';
            type: 'string';
          },
          {
            name: 'status';
            type: 'string';
          },
          {
            name: 'remarks';
            type: 'string';
          },
        ];
      };
    },
  ];
};
