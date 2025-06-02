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
      name: 'deliveryInProgress';
      discriminator: [111, 148, 3, 90, 214, 177, 162, 138];
      accounts: [
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'seller';
          writable: true;
          signer: true;
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
          name: 'mint';
        },
        {
          name: 'escrowOperationAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
        {
          name: 'escrowConfig';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ];
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
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'platformCode';
          type: 'string';
        },
      ];
    },
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
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
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
          name: 'authority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
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
        {
          name: 'operationTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
        {
          name: 'escrowConfig';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ];
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
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
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
        {
          name: 'buyerAssociatedTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'buyer';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
      ];
      args: [
        {
          name: 'orderId';
          type: {
            array: ['u8', 16];
          };
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
    {
      name: 'sampleWithdraw';
      discriminator: [192, 244, 163, 160, 43, 3, 73, 234];
      accounts: [
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
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
          name: 'escrowConfig';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
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
        {
          name: 'escrowAuthority';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
        {
          name: 'recipientTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'signer';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'escrowConfig';
      discriminator: [138, 174, 227, 187, 239, 148, 1, 44];
    },
    {
      name: 'order';
      discriminator: [134, 173, 223, 185, 77, 86, 28, 51];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'unauthorisedSeller';
      msg: 'Unauthorised Seller';
    },
    {
      code: 6001;
      name: 'unauthorisedAction';
      msg: 'Unauthorised Action';
    },
    {
      code: 6002;
      name: 'invalidMint';
      msg: 'Invalid Mint';
    },
  ];
  types: [
    {
      name: 'escrowConfig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bumpEscrowConfig';
            type: 'u8';
          },
          {
            name: 'bumpEscrowTokenAccount';
            type: 'u8';
          },
          {
            name: 'bumpAuthority';
            type: 'u8';
          },
          {
            name: 'bumpEscrowOperationAccount';
            type: 'u8';
          },
        ];
      };
    },
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
            name: 'orderId';
            type: {
              array: ['u8', 16];
            };
          },
          {
            name: 'platformCode';
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
          {
            name: 'bump';
            type: 'u8';
          },
        ];
      };
    },
  ];
};
