import type * as Types from '@app/Types.ts'

/**
 * NPWP format and decode helper.
 * @description Validates 15-digit NPWP; not BSSN/backend.
 */
export class NpwpValidator {
  /**
   * Strip NPWP to digits only.
   * @description Removes non-digit characters from input.
   * @param npwp - NPWP string with or without separators
   * @returns Digit-only string
   */
  static normalizeNpwp(npwp: string): string {
    return npwp.replace(/\D/g, '')
  }

  /**
   * Check NPWP format is valid.
   * @description Returns true when exactly 15 digits.
   * @param npwp - NPWP string to validate
   * @returns True when 15 digits
   */
  static isValidNpwpFormat(npwp: string): boolean {
    const digitsOnly = NpwpValidator.normalizeNpwp(npwp)
    return digitsOnly.length === 15 && /^\d{15}$/.test(digitsOnly)
  }

  /**
   * Decode NPWP into segments.
   * @description Returns segments or null if not 15 digits.
   * @param npwp - NPWP string to decode
   * @returns NpwpDecoded or null
   */
  static decodeNpwp15(npwp: string): Types.NpwpDecoded | null {
    const digitsOnly = NpwpValidator.normalizeNpwp(npwp)
    if (digitsOnly.length !== 15 || !/^\d{15}$/.test(digitsOnly)) {
      return null
    }
    const identitasWp = digitsOnly.slice(0, 2)
    const nomorRegistrasi = digitsOnly.slice(2, 8)
    const checkDigit = digitsOnly.slice(8, 9)
    const kodeKpp = digitsOnly.slice(9, 12)
    const statusCabang = digitsOnly.slice(12, 15)
    const formatted = `${identitasWp}.${digitsOnly.slice(2, 5)}.${
      digitsOnly.slice(5, 8)
    }.${checkDigit}-${kodeKpp}.${statusCabang}`
    return {
      identitasWp,
      nomorRegistrasi,
      checkDigit,
      kodeKpp,
      statusCabang,
      formatted
    }
  }
}
