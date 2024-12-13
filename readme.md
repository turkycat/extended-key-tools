# extended key tools

originally just a decoder, this repo's tools have slowly evolved and gotten more useful over time as I have needed them to.

## installation

```bash
npm install
```

## usage

```bash
node extended extended-key-decoder.js --help
```

example 1:
```bash
$ node extended-key-decoder.js -k tprv8ZgxMBicQKsPdhuKY6jDJqmSvtvqcRPCbsRvUbJsK7Zb19sLBfynUnrdC89Xwb3XhPjv1SLDJsu85T63AxRYzbpS417PUUkPCGLsU8FwMjm
version     : 0x04358394
depth       : 0
index       : 0
fingerprint : 0x3a54e6fd
private key : 0x8d5d22023be67af96b86489e53ea1b8c1673a8fae0354191d4717feb52a092de
            : <Buffer 8d 5d 22 02 3b e6 7a f9 6b 86 48 9e 53 ea 1b 8c 16 73 a8 fa e0 35 41 91 d4 71 7f eb 52 a0 92 de>
chain code  : 0x53aa48cfaebd77ce6969c648e12226e3db04f9888f14702cddc86da3c6dbf76d
            : <Buffer 53 aa 48 cf ae bd 77 ce 69 69 c6 48 e1 22 26 e3 db 04 f9 88 8f 14 70 2c dd c8 6d a3 c6 db f7 6d>
```

example 2:
```bash
$ node extended-key-decoder.js -k xpub6CSdFY7QRDDQMAZ3kHGHXJD5EB8mvaoHwhfzAjb3z73W9gYzha7CL674f2gZEcbM4ADZerxFoMqsWjU13CXGsZPb6LjviM8UWyxoRfxKwNd
version     : 0x0488b21e
depth       : 3
index       : 2147483648
fingerprint : 0x5096b9cd
public key  : 0x03621ff9eb504bc0489ab45cdfe319fbbe974b8439513d1ac2b929d2c6551319b9
            : <Buffer 03 62 1f f9 eb 50 4b c0 48 9a b4 5c df e3 19 fb be 97 4b 84 39 51 3d 1a c2 b9 29 d2 c6 55 13 19 b9>
chain code  : 0xed90a3d17185425795652baef5db5d273bb66252fc766057354b4312b12e0de8
            : <Buffer ed 90 a3 d1 71 85 42 57 95 65 2b ae f5 db 5d 27 3b b6 62 52 fc 76 60 57 35 4b 43 12 b1 2e 0d e8>
```

#### license

lol, do whatever you want