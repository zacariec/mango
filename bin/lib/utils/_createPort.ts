import net from 'net';
import { ServerAddressInfo } from '../../../types/types';

const _randomPort = async (): Promise<number> => {
  const server = net.createServer();
  return await new Promise((resolve) => {
    // casting 0 to the port will allow the OS to assign an unused port.
    server.listen(0, () => {
      const serverAddress = server.address() as ServerAddressInfo;
      server.close(); // close the server because we don't need it.

      resolve(serverAddress.port);
    });
  });
}

export default _randomPort;
