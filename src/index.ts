import type * as Types from '@app/Types.ts'
import { NpwpValidator } from '@app/Validator.ts'

/**
 * NPWP DJP API client.
 * @description Fetches WP data via getDataWp and postDataWp.
 */
export class NpwpClient {
  /** Default DJP API base URL */
  private static readonly defaultBase = 'https://omniassets.pajak.go.id'

  /**
   * Resolve API base URL.
   * @description Normalizes optional base or uses default.
   * @param base - Optional base URL
   * @returns Trailing-slash stripped base URL
   */
  private static getBase(base?: string): string {
    return (base ?? NpwpClient.defaultBase).replace(/\/$/, '')
  }

  /**
   * Fetch WP data by NPWP.
   * @description GET getDataWp; normalizes NPWP to 15 digits.
   * @param npwp - NPWP with or without separators
   * @param base - Optional API base URL
   * @returns GetDataWpResult with ok, data, message, status
   */
  static async getDataWp(npwp: string, base?: string): Promise<Types.GetDataWpResult> {
    const apiBase = NpwpClient.getBase(base)
    const npwpDigits = NpwpValidator.normalizeNpwp(npwp)
    if (npwpDigits.length !== 15) {
      return { ok: false, message: 'NPWP must be 15 digits' }
    }
    const requestUrl = `${apiBase}/api/v1/getDataWp?npwp=${encodeURIComponent(npwpDigits)}`
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })
      const responseText = await response.text()
      let parsedData: unknown
      try {
        parsedData = JSON.parse(responseText) as unknown
      } catch {
        return {
          ok: false,
          message: 'Invalid JSON response',
          status: response.status
        }
      }
      const responseBody = parsedData as Types.DataWp
      if (!response.ok) {
        return {
          ok: false,
          data: responseBody,
          message: responseBody.message ?? `HTTP ${response.status}`,
          status: response.status
        }
      }
      const isFound = responseBody.status !== 'NOT FOUND'
      return {
        ok: isFound,
        data: responseBody,
        message: responseBody.message,
        status: response.status
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      return { ok: false, message: `Request failed: ${errorMessage}` }
    }
  }

  /**
   * POST data to postDataWp endpoint.
   * @description Sends JSON body; returns result with ok, data, message.
   * @param requestBody - JSON body (e.g. { npwp })
   * @param base - Optional API base URL
   * @returns PostDataWpResult with ok, data, message, status
   */
  static async postDataWp(
    requestBody: Record<string, unknown>,
    base?: string
  ): Promise<Types.PostDataWpResult> {
    const apiBase = NpwpClient.getBase(base)
    const requestUrl = `${apiBase}/api/v1/postDataWp`
    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(requestBody)
      })
      const responseText = await response.text()
      let parsedData: unknown
      try {
        parsedData = responseText ? (JSON.parse(responseText) as unknown) : undefined
      } catch {
        return {
          ok: false,
          message: 'Invalid JSON response',
          status: response.status
        }
      }
      const responseBody = parsedData as Record<string, unknown> | undefined
      const isResponseOk = response.ok
      const resultMessage = (responseBody?.['message'] as string) ??
        (responseBody?.['error_msg'] as string) ??
        (isResponseOk ? undefined : `HTTP ${response.status}`)
      return {
        ok: isResponseOk,
        ...(responseBody !== undefined && { data: responseBody }),
        message: resultMessage,
        status: response.status
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      return { ok: false, message: `Request failed: ${errorMessage}` }
    }
  }
}
