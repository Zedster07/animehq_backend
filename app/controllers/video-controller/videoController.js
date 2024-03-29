const path = require('path');
const fs = require('fs');
const { customDecrypt } = require('../../utils');
const config = require('../../config/config');
const {Throttle} = require('stream-throttle');
class VideoController {


    


    static async streamFile(req, res) {
        let { dcpath } = req.params;

        let tmp = dcpath.split('.');
        dcpath = tmp[0];
        const pp = customDecrypt(dcpath);   
        var parts = pp.split('/');
        var filename = parts[parts.length - 1];
	    const range = req.headers.range;
        if (false) {
            res.status(400).send("UNAUTHORIZED");
        } else {
            const videoPath = path.join(config.serverPath, pp);
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

    static createThrottledStream(filePath, speedLimitMbps) {
        const readStream = fs.createReadStream(filePath);
        const throttleStream = new Throttle({ rate: speedLimitMbps * 1024 * 1024 }); // Convert speed limit to bytes per second
        readStream.pipe(throttleStream);
        return throttleStream;
    }

     static async downloadFile(req, res) {

        let { dcpath } = req.params;
        var addition = dcpath.split('-@-');
        console.log(addition);
        let tmp = addition[0].split('.');
        dcpath = tmp[0];
        const pp = customDecrypt(dcpath);
       
        var parts = pp.split('/');
        var filename = parts[parts.length - 1];
        const videoPath = path.join(config.serverPath, pp);

        const fileStats = fs.statSync(videoPath);
        const fileSize = fileStats.size;
        console.log(videoPath);
        const range = req.headers.range;
        
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', fileSize.toString());
        const readStream = fs.createReadStream(videoPath);
        let speed = 10;
        if(addition[1] == '+') {
            // speed = 0;
            res.status(401);
        } else {
            readStream.pipe(new Throttle({rate: 1024*1024*speed})).pipe(res);
        }
    }
}

module.exports = VideoController;