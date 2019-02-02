/**
 * @name CryptoHelper
 * @desc Algorithmes de cryptage SHA-1 et MD5
 * @author IDea Factory - Fév. 2019 (dev-team@ideafactory.fr) http://webtoolkit.com
 * @package Helpers
 * @version 1.0.0
 */

 export class CryptoHelper {
    private static toEncode: string;
    private static encoded: string;

    public static SHA(toEncode: string): string {
        CryptoHelper.toEncode = CryptoHelper.UTF8Encode(toEncode);

        CryptoHelper.encoded = CryptoHelper._sha1();

        return CryptoHelper.encoded;
    }

    public static getEncoded(): string {
        return CryptoHelper.encoded;
    }

    private static _sha1(): string {
        let blockStart;

        let w: Array<number> = new Array(80);

        let hexa0: number = 0x67452301;
        let hexa1: number = 0xEFCDAB89;
        let hexa2: number = 0x98BADCFE;
        let hexa3: number = 0x10325476;
        let hexa4: number = 0xC3D2E1F0;

        let A, B, C, D, E: any;

        let temp: number;

        const dataLength: number = CryptoHelper.toEncode.length;

        let wordArray: Array<number> = new Array<number>();

        for (let i: number = 0; i < dataLength - 3; i += 4) {
            let j: number = CryptoHelper.toEncode.charCodeAt(i)<<24 | CryptoHelper.toEncode.charCodeAt(i+1)<<16 |
                CryptoHelper.toEncode.charCodeAt(i+2)<<8 | CryptoHelper.toEncode.charCodeAt(i+3);
                wordArray.push(j);          
        }

        let charCode: number;

        switch( dataLength % 4 ) {
            case 0:
                charCode = 0x080000000;
            break;
        
            case 1:
                charCode = CryptoHelper.toEncode.charCodeAt(dataLength-1)<<24 | 0x0800000;
            break;
        
            case 2:
                charCode = CryptoHelper.toEncode.charCodeAt(dataLength-2)<<24 | CryptoHelper.toEncode.charCodeAt(dataLength-1)<<16 | 0x08000;
            break;
        
            case 3:
                charCode = CryptoHelper.toEncode.charCodeAt(dataLength-3)<<24 | CryptoHelper.toEncode.charCodeAt(dataLength-2)<<16 | CryptoHelper.toEncode.charCodeAt(dataLength-1)<<8    | 0x80;
            break;
        }

        wordArray.push(charCode);

        while( (wordArray.length % 16) != 14 ) wordArray.push( 0 );

        wordArray.push( dataLength>>>29 );

        wordArray.push( (dataLength << 3)&0x0ffffffff );

        for ( blockStart=0; blockStart<wordArray.length; blockStart+=16 ) {
            for( let i: number = 0; i < 16; i++ ) w[i] = wordArray[blockStart+i];
        
        
            for( let i = 16; i <= 79; i++ ) w[i] = CryptoHelper._rotateLeft(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
        
            A = hexa0;
            B = hexa1;
            C = hexa2;
            D = hexa3;
            E = hexa4;
        
            for( let i = 0; i <= 19; i++ ) {
        
        
                temp = (CryptoHelper._rotateLeft(A,5) + ((B&C) | (~B&D)) + E + w[i] + 0x5A827999) & 0x0ffffffff;

                E = D;        
                D = C;
                C = CryptoHelper._rotateLeft(B,30);
                B = A;
                A = temp;
            }
        
            for( let i: number = 20; i <= 39; i++ ) {
                temp = (CryptoHelper._rotateLeft(A,5) + (B ^ C ^ D) + E + w[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = CryptoHelper._rotateLeft(B,30);
                B = A;
                A = temp;
            }
        
            for( let i: number = 40; i <= 59; i++ ) {
                temp = (CryptoHelper._rotateLeft(A,5) + ((B&C) | (B&D) | (C&D)) + E + w[i] + 0x8F1BBCDC) & 0x0ffffffff;
                
                E = D;
                D = C;
                C = CryptoHelper._rotateLeft(B,30);
                B = A;
                A = temp;
            }
        
            for( let i: number = 60; i <= 79; i++ ) {

                temp = (CryptoHelper._rotateLeft(A,5) + (B ^ C ^ D) + E + w[i] + 0xCA62C1D6) & 0x0ffffffff;
    
                E = D;
                D = C;
                C = CryptoHelper._rotateLeft(B,30);
                B = A;
                A = temp;
            }
        }

        hexa0 = (hexa0 + A) & 0x0ffffffff;
        hexa1 = (hexa1 + B) & 0x0ffffffff;
        hexa2 = (hexa2 + C) & 0x0ffffffff;
        hexa3 = (hexa3 + D) & 0x0ffffffff;
        hexa4 = (hexa4 + E) & 0x0ffffffff;

        return CryptoHelper._convertHex(hexa0) + 
            CryptoHelper._convertHex(hexa1) + 
            CryptoHelper._convertHex(hexa2) + 
            CryptoHelper._convertHex(hexa3) + 
            CryptoHelper._convertHex(hexa4).toLowerCase();
    }

    private static _rotateLeft(n: number, s: number) {
        return ( n << s) | (n >>> (32 - s));
    }

    private static _lsbHex(value: number): string {
        let returnValue = '';
        let vh;
        let vl;

        for (let i: number = 0; i <= 6; i += 2) {
            vh = (value >>> (i*4+4))&0x0f;

            vl = (value >>> (i*4))&0x0f;


            returnValue += vh.toString(16) + vl.toString(16);
        }

        return returnValue;
    }

    private static _convertHex(value: number): string {
        let returnValue: string;
        let v: number;

        for (let i = 7; i >= 0; i--) {
            v = (value >>> (i*4))&0x0f;


            returnValue += v.toString(16);            
        }
        return returnValue;
    }

    private static UTF8Encode(value: string): string {
        let utfText: string;

        value = value.replace(/\r\n/g,"\n");

        for (let i: number = 0; i < value.length; i++) {
            let c = value.charCodeAt(i);

            if (c < 128) {
                utfText += String.fromCharCode(c);


            } else if ((c > 127) && (c < 2048)) {
                utfText += String.fromCharCode((c >> 6) | 192);
                utfText += String.fromCharCode((c & 63) | 128);
            } else {
                utfText += String.fromCharCode((c >> 12) | 224);
                utfText += String.fromCharCode(((c >> 6) & 63) | 128);
                utfText += String.fromCharCode((c & 63) | 128);
            }
        }
        return utfText;
    }
 }