const fs = require('fs-extra');
const path = require('path');

const liveReload = async () => {
    try {
        const fileData = await fs.readFile(path.resolve('./shop/src/layout/theme.liquid'));
        if(fileData.toString().includes('<!-- Start Live Server Reloading -->') === false) {
            const fileArray = fileData.toString().split('</body>');
            const dataToWrite = `
                ${fileArray[0]}
                    <!-- Start Live Server Reloading -->
                    <script>
                        var ws = new WebSocket('ws://localhost:9000');
                        ws.onmessage = function(evt) { location.reload(); }
                    </script>
                    <!-- End Live Server Reloading -->
                </body>
                ${fileArray[1]}
            `;

            await fs.writeFile(path.resolve('./shop/src/layout/theme.liquid'), dataToWrite);
        }
    } catch (err) {
        return console.error(err);
    }
};

module.exports = {
    liveReload
};