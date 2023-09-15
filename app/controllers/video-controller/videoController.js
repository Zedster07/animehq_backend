const path = require('path');
const fs = require('fs');
const session = require('express-session');

class VideoController {
    static async streamFile(req, res) {
        let { dcpath } = req.params;

        let tmp = dcpath.split('.');

        dcpath = tmp[0];
        console.log(dcpath);
        const pp = customDecrypt(dcpath);
        console.log(pp);    
        var parts = pp.split('/');
        var filename = parts[parts.length - 1];
	    const range = req.headers.range;
        if (!range) {
            res.status(400).send("UNAUTHORIZED");
        } else {
            const videoPath = path.join(__dirname, pp);
            console.log(videoPath);
            if( 
                (req.useragent.isMobile && ( req.useragent.isiPhone || req.useragent.isiPhoneNative)) ||
                (req.useragent.isSafari) || (req.useragent.isiPad) || (req.useragent.isiPod) ||
                (req.useragent.source.includes('SmartTV') || req.useragent.source.includes('AppleWebKit'))
            ) {
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.download(videoPath);
            } else {
                const videoSize = fs.statSync(videoPath).size;
                const CHUNK_SIZE = 10 ** 6;
                const start = range ? Number(range.replace(/\D/g, "")) : 0;
                const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
                const contentLength = end - start + 1;
                const headers = {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": contentLength,
                    "Content-Type": "video/mp4",
                };

                res.writeHead(206, headers);

                const videoStream = fs.createReadStream(videoPath, { start, end });
                videoStream.pipe(res);
            }
        }
    }

    static async downloadFile(req , res) {
        let { dcpath } = req.params;

        let tmp = dcpath.split('.');

        dcpath = tmp[0];
        console.log(dcpath);
        const pp = customDecrypt(dcpath);
        console.log(pp);    
        var parts = pp.split('/');
        var filename = parts[parts.length - 1];
            
        const videoPath = path.join(__dirname, pp);

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/octet-stream');

        res.download(videoPath);
    }
}

module.exports = VideoController;