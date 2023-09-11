const CryptoJS = require("crypto-js");

export function Encrypt(str:string) 
{
	let Encrypt = CryptoJS.AES.encrypt(JSON.stringify(str), 'erpSystem').toString();
	return Encrypt.replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l');
}

export function Decrypt(str:string) 
{
	let Decrypt = str.replace(/p1L2u3S/g, '+' ).replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
	return JSON.parse(CryptoJS.AES.decrypt(Decrypt, 'erpSystem').toString(CryptoJS.enc.Utf8));
}