import { FC } from 'react';

import { AdminWithdrawProfitForm } from '@/components/form/admin-withdraw-profit-form/admin-withdraw-profit-form';

type WithdrawProfitModalProps = {
  isOpen: boolean;
  escrowOperationAccountPublicKey: string;
  maxAvailableProfit: number;
  closeModalFn: () => void;
};

export const WithdrawProfitModal: FC<WithdrawProfitModalProps> = ({
  escrowOperationAccountPublicKey,
  maxAvailableProfit,
  isOpen,
  closeModalFn,
}) => {
  if (!isOpen) return <></>;

  return (
    <dialog
      className="modal"
      open
    >
      <div className="modal-box">
        <AdminWithdrawProfitForm
          cancelFn={closeModalFn}
          maxAvailableProfit={maxAvailableProfit}
          escrowOperationAccountPublicKey={escrowOperationAccountPublicKey}
        />
      </div>

      {/* Backdrop handling close modal by clicking outside of modal */}
      <div
        className="modal-backdrop cursor-pointer opacity-40 bg-white dark:bg-black"
        onClick={closeModalFn}
      ></div>
    </dialog>
  );
};
