'use client';

import { FC, useState } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import TextInput from '@/components/ui/inputs/text-input';
import { useSellerRegister } from '@/hooks/queries/seller/seller-register/seller-register';

type SellerRegisterFormProps = {};

const SellerRegisterForm: FC<SellerRegisterFormProps> = () => {
  const [sellerName, setSellerName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');

  const isSubmitDisabled =
    !Boolean(sellerName.trim().length) || !Boolean(emailAddress.trim().length);

  const { isPending: isSellerRegisterPending, mutateAsync: registerSellerFn } =
    useSellerRegister();

  const submitHandler = async () => {
    if (isSubmitDisabled) return;

    await registerSellerFn({
      email: emailAddress.trim().toLowerCase(),
      name: sellerName.trim(),
    });
  };

  return (
    <div className="flex justify-center pt-4">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 w-xs max-w-96">
        <legend className="fieldset-legend font-bold">Seller Register</legend>
        <TextInput
          setValue={setSellerName}
          value={sellerName}
          label="Store Name"
          onEnterPressed={submitHandler}
          className="w-full"
          disabled={isSellerRegisterPending}
        />
        <TextInput
          setValue={setEmailAddress}
          value={emailAddress}
          label="Email address"
          onEnterPressed={submitHandler}
          className="w-full"
          disabled={isSellerRegisterPending}
        />
        <PrimaryButton
          onClick={submitHandler}
          className="w-full mt-5"
          disabled={isSubmitDisabled}
          loading={isSellerRegisterPending}
        >
          Register
        </PrimaryButton>
      </fieldset>
    </div>
  );
};

export default SellerRegisterForm;
