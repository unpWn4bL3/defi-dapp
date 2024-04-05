import { SerializedSignature } from '@mysten/sui.js/cryptography'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { getZkLoginSignature, jwtToAddress, genAddressSeed, getExtendedEphemeralPublicKey, generateRandomness, generateNonce } from '@mysten/zklogin'
import { jwtDecode } from 'jwt-decode'
import { SUI_CLIENT } from './suiService'

const REACT_APP_PROVER_URL = process.env.REACT_APP_PROVER_URL!
const REACT_APP_REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL!
const REACT_APP_OPENID_PROVIDER_URL = process.env.REACT_APP_OPENID_PROVIDER_URL!
const REACT_APP_CLIENT_ID = process.env.REACT_APP_CLIENT_ID!

export class AuthService {
  static getAddressSeed() {
    const jwt = AuthService.decodeJwt()
    const salt = AuthService.salt()
    return genAddressSeed(BigInt(salt), 'sub', jwt.sub!, jwt.aud!.toString()).toString()
  }

  static getEd25519Keypair(): Ed25519Keypair {
    const jwtData = AuthService.getJwtData()
    const publicKey = new Uint8Array(Object.values(jwtData.ephemeralKeyPair.keypair.publicKey))
    const secretKey = new Uint8Array(Object.values(jwtData.ephemeralKeyPair.keypair.secretKey))
    return new Ed25519Keypair({ publicKey, secretKey })
  }

  static async getPartialZkLoginSignature(): Promise<any> {
    const keyPair = AuthService.getEd25519Keypair()
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(keyPair.getPublicKey())
    const verificationPayload = {
      jwt: AuthService.jwt(),
      extendedEphemeralPublicKey,
      maxEpoch: this.getMaxEpoch(),
      jwtRandomness: this.getRandomness(),
      salt: AuthService.salt(),
      keyClaimName: 'sub'
    }
    return await AuthService.verifyPartialZkLoginSignature(verificationPayload)
  }

  private static async verifyPartialZkLoginSignature(zkRequestPayload: any) {
    try {
      const proofResponse = await fetch(REACT_APP_PROVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: zkRequestPayload
      })
      const partialZkLoginSignature = await proofResponse.json() as PartialZkLoginSignature
      return partialZkLoginSignature
    } catch (error) {
      console.log('failed to requeset the partial sig: ', error)
      return {}
    }
  }

  static async generateZkLoginSignature(userSignature: string): Promise<SerializedSignature> {
    const partialZkLoginSignature = await AuthService.getPartialZkLoginSignature()
    const addressSeed = AuthService.getAddressSeed()
    const maxEpoch = AuthService.getMaxEpoch()
    return getZkLoginSignature({
      inputs: {
        ...partialZkLoginSignature,
        addressSeed
      },
      maxEpoch,
      userSignature
    })
  }

  static getMaxEpoch() {
    return this.getJwtData().maxEpoch
  }

  static getRandomness() {
    return this.getJwtData().randomness
  }

  private static getJwtData() {
    const jwt_data_stirng = sessionStorage.getItem('jwt_data')
    if (jwt_data_stirng) {
      const jwt_data = JSON.parse(jwt_data_stirng)
      return jwt_data
    }
    return {}
  }

  private static decodeJwt(): JwtPayload {
    const sui_jwt_token_string = sessionStorage.getItem('sui_jwt_token')
    return sui_jwt_token_string ? jwtDecode(sui_jwt_token_string) : {}
  }

  private static salt() {
    const email = AuthService.claims().email
    return AuthService.hashcode(email)
  }

  static walletAddress() {
    const email = AuthService.claims().email
    return jwtToAddress(AuthService.jwt(), AuthService.hashcode(email))
  }

  private static claims() {
    const token = AuthService.jwt()
    if (token) {
      return JSON.parse(atob(token.split('.')[1]))
    }
  }

  private static hashcode(s: string) {
    let h = 0; const l = s.length; let i = 0
    if (l > 0) {
      while (i < 1) {
        h = (h << 5) - h + s.charCodeAt(i++) | 0
      }
    }
    return h.toString()
  }

  static isAuthenticated() {
    const token = AuthService.jwt()
    return token && token !== 'null'
  }

  static jwt(): string {
    return sessionStorage.getItem('sui_jwt_token') ?? ''
  }

  async login() {
    const { epoch } = await SUI_CLIENT.getLatestSuiSystemState()
    const maxEpoch = Number(epoch) + 2222
    const ephemeralKeyPair = new Ed25519Keypair()
    const randomness = generateRandomness()
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness)
    const jwtData = {
      maxEpoch,
      nonce,
      randomness,
      ephemeralKeyPair
    }
    console.log({ jwtData })
    sessionStorage.setItem('jwt_data', JSON.stringify(jwtData))

    const params = new URLSearchParams({
      client_id: REACT_APP_CLIENT_ID,
      redirect_uri: REACT_APP_REDIRECT_URL,
      response_type: 'id_token',
      scope: 'openid email',
      nonce
    })
    console.log(params)

    try {
      const response = await fetch(REACT_APP_OPENID_PROVIDER_URL, {
        method: 'GET'
      })
      const data = await response.json()
      console.log(data)
      const authUrl = `${data.authorization_endpoint}?${params}`
      window.location.href = authUrl
    } catch (error) {
      console.log('Error initiating google login: ', error)
    }
  }
}

export interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string[] | string
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
}

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>[0]['inputs'],
  'addressSeed'
>
