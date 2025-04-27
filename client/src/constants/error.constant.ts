export const GeneralErrorMessage = Object.freeze({
  SOMETHING_WENT_WRONG: 'Oops! Something went wrong!',
  SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN:
    'Oops! Something went wrong! Please try again in a few seconds!',
  SOMETHING_WENT_WRONG_PLEASE_CONTACT_SUPPORT:
    'Oops! Something went wrong! Please contact our customer support!',
} as const);
export type GeneralErrorMessage =
  (typeof GeneralErrorMessage)[keyof typeof GeneralErrorMessage];
