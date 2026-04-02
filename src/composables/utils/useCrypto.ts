import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { argon2id } from '@noble/hashes/argon2.js'
import { openDB } from 'idb'
import { randomBytes } from '@noble/hashes/utils.js';
import * as aes256gcm from '@noble/ciphers/aes.js'

// generate recovery phrase
// used as a last resort recovery in case of loss of user password
// used to regenerate master key to decrypt messages
export const generateRecoveryPhrase = (): string => {
    return generateMnemonic(wordlist)
}

// generate master key from recovery phrase
// master key derived from the recovery phrase
// this key is used to generate enryption keypairs to exchange symmetric enryption keys to encrypt messages 
export const deriveMasterKeyFromPhrase = async (phrase: string): Promise<Uint8Array> => {
    const fixedSalt = new TextEncoder().encode("qonsensus"); // intentional fixed array buffer
    const seed = mnemonicToSeedSync(phrase)
    const masterKey = argon2id(
        seed,
        fixedSalt,
        {
            t: 3, // iterations
            m: 65536, // memory used in kb
            p: 4, // threads used
            dkLen: 32 // keylength
        }
    );

    return masterKey
}

// derive key from user password
export const deriveLoginKeyFromPassword = async (password: string, salt: Uint8Array): Promise<Uint8Array> => {
    const encodedPass = new TextEncoder().encode(password)
    return argon2id(
        encodedPass,
        salt,
        {
            t: 3, // iterations
            m: 65536, // memory used in kb
            p: 4, // threads used
            dkLen: 32 // keylength
        }
    )
}

// encrypt master key with key derived from user password
// this is required so the masterkey can be safely stored
export const encryptMasterKey = async (
    masterKey: Uint8Array,
    password: string
): Promise<{ ciphertext: Uint8Array, salt: Uint8Array, nonce: Uint8Array}> => {
    const salt = randomBytes(32)
    const loginKey = await deriveLoginKeyFromPassword(password, salt)

    const nonce = randomBytes(12) // random IV
    const cipher = aes256gcm.gcm(loginKey, nonce);
    const ciphertext = cipher.encrypt(masterKey)

    return { ciphertext, salt, nonce }
}

// create local db
// for local key storage
export const initDB = async () => {
    return openDB('qonsensus-key-db', 1, {
        upgrade(db) {
            db.createObjectStore('messages', { keyPath: 'id' })
            db.createObjectStore('keys')
        }
    })
}