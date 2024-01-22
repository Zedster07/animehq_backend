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

    // static async downloadFile(req, res) {

    //     let { dcpath } = req.params;
    
    //     let tmp = dcpath.split('.');
    
    //     dcpath = tmp[0];
    //     const pp = customDecrypt(dcpath);
    //     var parts = pp.split('/');
    //     var filename = parts[parts.length - 1];
    
    //     const videoPath = path.join(config.serverPath, pp);
    
    //     const fileStats = fs.statSync(videoPath);
    //     const fileSize = fileStats.size;
        
        
    //     const range = req.headers.range;
    //     if (range) {
    //         const videoSize = fs.statSync(videoPath).size;
    //         const CHUNK_SIZE = 10 ** 6;
    //         const start = range ? Number(range.replace(/\D/g, "")) : 0;
    //         const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    //         const contentLength = end - start + 1;
    //         const headers = {
    //             "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    //             "Accept-Ranges": "bytes",
    //             "Content-Length": contentLength,
    //             "Content-Type": "video/mp4",
    //         };

    //         res.writeHead(206, headers);

    //         const videoStream = fs.createReadStream(videoPath, { start, end });
    //         videoStream.pipe(res);
    //     } else {
    //         res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    //         res.setHeader('Content-Type', 'application/octet-stream');
    //         res.setHeader('Content-Length', fileSize.toString());
    //         res.download(videoPath);
    //     }
        
    //     // // Create a throttled stream with the specified speed limit (50 Mbps)
    //     // const throttledStream = VideoController.createThrottledStream(videoPath, 40);
    
    //     // // Handle errors if necessary
    //     // throttledStream.on('error', (err) => {
    //     //     console.error(err);
    //     //     res.status(500).send('Internal Server Error');
    //     // });
    
    //     // // Pipe the throttled stream to the response
    //     // throttledStream.pipe(res);
    // }


     static async downloadFile(req, res) {
        let { dcpath } = req.params;
        let tmp = dcpath.split('.');
        dcpath = tmp[0];
        const pp = customDecrypt(dcpath);
        var parts = pp.split('/');
        var filename = parts[parts.length - 1];
        const videoPath = path.join(config.serverPath, pp);

        const fileStats = fs.statSync(videoPath);
        const fileSize = fileStats.size;
        console.log(videoPath);
        const range = req.headers.range;
        
        // res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        // res.setHeader('Content-Type', 'application/octet-stream');
        // res.setHeader('Content-Length', fileSize.toString());
        
        
        if (range) {
            console.log("there is range");
            const videoSize = fs.statSync(videoPath).size;
            const CHUNK_SIZE = 10 ** 6;
            const start = range ? Number(range.replace(/\D/g, "")) : 0;
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;

            if (start >= 0 && start <= videoSize - 1) { // Check if start is within valid range
                const headers = {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": contentLength,
                    "Content-Type": "video/mp4",
                };

                res.writeHead(206, headers);
                const readStream = fs.createReadStream(videoPath);
                // Create a throttled stream with the specified speed limit (40 Mbps)
                // const throttledStream = VideoController.createThrottledStream(videoPath, 10);


                // Pipe the throttled stream with the specified range to the response
                // throttledStream.pipe(res, { start, end });
                readStream.pipe(new Throttle({rate: 1024*1024*30})).pipe(res, {start,end});
            } else {
                res.status(416).send('Requested Range Not Satisfiable'); // 416 Range Not Satisfiable
            }
        } else {
            console.log("NO RANGE");
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Length', fileSize.toString());
            const readStream = fs.createReadStream(videoPath);
            readStream.pipe(new Throttle({rate: 1024*1024*30})).pipe(res);
            // // Create a throttled stream with the specified speed limit (40 Mbps)
            // const throttledStream = VideoController.createThrottledStream(videoPath, 10);

            // // Handle errors if necessary
            // throttledStream.on('error', (err) => {
            //     console.error(err);
            //     res.status(500).send('Internal Server Error');
            // });

            // // Pipe the throttled stream to the response
            // throttledStream.pipe(res);
        }
    }
}

module.exports = VideoController;