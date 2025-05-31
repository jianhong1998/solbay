import { FC, useEffect, useMemo, useState } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import NumberInput from '@/components/ui/inputs/number-input';

type DummyUsdcAirdropRequestPopupProps = {
  isOpen: boolean;
  closePopupFn: () => void;
  requestAirdropHandler: (amount: number) => Promise<void>;
  isAirdropPending: boolean;
};

export const DummyUsdcAirdropRequestPopup: FC<
  DummyUsdcAirdropRequestPopupProps
> = ({ closePopupFn, isAirdropPending, isOpen, requestAirdropHandler }) => {
  const [amount, setAmount] = useState<number>(0);
  const isRequestAirdropButtonDisabled = useMemo(() => {
    return amount <= 0 || isAirdropPending;
  }, [amount, isAirdropPending]);

  const requestAirdropButtonOnClickHandler = () => {
    requestAirdropHandler(amount);
  };

  useEffect(() => {
    if (!isOpen && amount !== 0) {
      setAmount(0);
    }
  }, [isOpen, amount]);

  if (!isOpen) return <></>;

  return (
    <dialog
      className="modal"
      open
    >
      <div className="modal-box">
        <div className="flex flex-col gap-3">
          <div className="text-xl font-bold">Request Airdrop Dummy USDC</div>
          <div>
            <NumberInput
              className="w-full"
              value={amount}
              setValue={setAmount}
              label="USDC Amount"
              minValue={0}
              maxDigit={6}
              onEnterPressed={requestAirdropButtonOnClickHandler}
            />
          </div>
        </div>

        <div className="modal-action">
          <PrimaryButton
            onClick={closePopupFn}
            disabled={isAirdropPending}
            buttonStyle="outlined"
          >
            Close
          </PrimaryButton>
          <PrimaryButton
            onClick={requestAirdropButtonOnClickHandler}
            disabled={isRequestAirdropButtonDisabled}
          >
            Request Airdrop
          </PrimaryButton>
        </div>
      </div>

      {/* Backdrop handling close modal by clicking outside of modal */}
      <div
        className="modal-backdrop cursor-pointer opacity-40 bg-white dark:bg-black"
        onClick={closePopupFn}
      ></div>
    </dialog>
  );
};
