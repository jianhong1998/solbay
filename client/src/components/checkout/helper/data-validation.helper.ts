import { ILogisticInfoFormData } from '@/components/form/checkout-delivery-form/logistic-info-form-data.type';

export class CheckoutDataValidationHelper {
  private constructor() {}

  /**
   * @note `streetLine2` and `streetLine3` are optional, so empty string is acceptable
   * @returns All logistic info data are valid.
   */
  public static validateLogisticInfoFormData(
    formData: ILogisticInfoFormData,
  ): boolean {
    const {
      recipientName,
      countryCode,
      contactNumber,
      streetLine1,
      city,
      country,
      postalCode,
    } = formData;

    if (!recipientName.trim().length) return false;
    if (countryCode === 0 || contactNumber === 0) return false;
    if (!streetLine1.trim().length) return false;
    if (!city.trim().length) return false;
    if (!country.trim().length) return false;
    if (postalCode === 0) return false;

    return true;
  }
}
