import fs from 'fs-extra';
import path from 'path';

// Function to remove the live reload from the layout files.
const removeLiveReload = async (): Promise<void> => {
  const regexString = /<!-- Start Live Server Reloading -->([\s\S]*?)<!-- End Live Server Reloading -->/g;
  try {
    const files: string[] = await fs.readdir(path.resolve('./shop/src/layout'));
    for await (const file of files) {
      const fileData: Buffer = await fs.readFile(`./shop/src/layout/${file}`);
      if (fileData.toString().match(regexString)) {
        const dataToWrite: string = fileData.toString().replace(regexString, '');
        await fs.writeFile(path.resolve(`./shop/src/layout/${file}`), dataToWrite);
      }
    }
  } catch (err) {
    return console.error(err);
  }
}

// Function to add the websocket/live reload functionality to layout files.
const liveReload = async (port: number): Promise<void> => {
  const websocketPort = `ws://localhost:${port}`;

  try {
    const files = await fs.readdir(path.resolve('./shop/src/layout'));
    for await (const file of files) {
      const fileData = await fs.readFile(path.resolve(`./shop/src/layout/${file}`));
      if (fileData.toString().includes('<!-- Start Live Server Reloading -->') === false) {
        const fileArray = fileData.toString().split('</body>');
        const dataToWrite = `${fileArray[0]}
          <!-- Start Live Server Reloading -->
          <script>
            var ws = new WebSocket('${websocketPort}');
            ws.onmessage = function(evt) { location.reload(); }
          </script>
          <!-- End Live Server Reloading -->
        </body>
        ${fileArray[1]}`;

        await fs.writeFile(path.resolve(`./shop/src/layout/${file}`), dataToWrite);
      }
    }
  } catch (err) {
    return console.error(err);
  }
};

export {
  liveReload,
  removeLiveReload
};
