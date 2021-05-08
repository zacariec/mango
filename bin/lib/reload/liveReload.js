const WebSocket = require('ws');
const fs = require('fs-extra');
const path = require('path');

const liveReload = () => {
    fs.readFile(path.resolve('./shop/src/layout/theme.liquid'), 'utf-8', (err, data) => {
        if(err) console.error(err);
        if(data.toString().includes('<!-- Start Live Server Reloading -->') === false) {
            const fileArray = data.toString().split('</body>');
            const dataToWrite = `
                ${fileArray[0]}
                    <!-- Start Live Server Reloading -->
                    <script>
                        var ws = new WebSocket('ws://localhost:3050');
                        ws.onmessage = function(evt) { location.reload(); }
                    </script>
                    <!-- End Live Server Reloading -->
                </body>
                ${fileArray[1]}
            `;

            fs.writeFile(path.resolve('./shop/src/layout/theme.liquid'), dataToWrite, (err, cb) => {
                if(err) console.error(err);
            });
        } 
    });
};

module.exports = {
    liveReload
};
