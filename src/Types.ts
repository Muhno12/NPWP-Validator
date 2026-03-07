/**
 * Raw getDataWp response body.
 * @description Always has kd_status, status, message.
 */
export interface DataWp {
  /** Address when present */
  alamat?: string
  /** Status code from DJP */
  kd_status: string
  /** KLU when present */
  klu?: string
  /** Message from API */
  message: string
  /** Name when present */
  nama?: string
  /** NPWP when present */
  npwp?: string
  /** FOUND or NOT FOUND */
  status: string
  [key: string]: unknown
}

/**
 * Result of GET getDataWp.
 * @description Ok flag, optional data, message, status.
 */
export interface GetDataWpResult {
  /** WP data when found */
  data?: DataWp
  /** Error or info message */
  message?: string
  /** True when request and lookup ok */
  ok: boolean
  /** HTTP status code */
  status?: number
}

/**
 * Decoded 15-digit NPWP segments.
 * @description Format 99.999.999.9-999.999.
 */
export interface NpwpDecoded {
  /** Check digit, 1 digit */
  checkDigit: string
  /** Formatted 99.999.999.9-999.999 */
  formatted: string
  /** WP identity, 2 digit */
  identitasWp: string
  /** KPP code, 3 digit */
  kodeKpp: string
  /** Registration number, 6 digit */
  nomorRegistrasi: string
  /** Branch status, 3 digit */
  statusCabang: string
}

/**
 * Result of POST postDataWp.
 * @description Ok flag, optional data, message, status.
 */
export interface PostDataWpResult {
  /** Response body when present */
  data?: Record<string, unknown>
  /** Error or info message */
  message?: string
  /** True when HTTP ok */
  ok: boolean
  /** HTTP status code */
  status?: number
}
