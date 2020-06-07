
/**
 * Returns SHA-256 hash from supplied message.
 *
 * @param   {String} message.
 * @param 	{String} type
 * @returns {String} hash as hex string.
 * @see https://gist.github.com/chrisveness/e5a07769d06ed02a2587df16742d3fdd
 *
 * @example
 *   sha('abc').then(hash => console.log(hash));
 *   const hash = await sha('abc', 'SHA-1');
 */
export async function sha(message, protocol = 'SHA-256') {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest(protocol, msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}
