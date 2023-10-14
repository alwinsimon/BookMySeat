import nats, { Stan } from "node-nats-streaming";

class NatsClient {

  // Define a client property of type Stan which will be used to connect to the NATS server.
  private _client?: Stan;

  /* 
    Getter function to access the _client property of the class safely inside and outside of this class.
    At any point if _client is not connected to the server, this method will make sure to throw an error indicating the same.
    This prevents using the _client if it is not connected to the server.
  */
  get client() {
    // Preventing accessing client before client is being connected to NATS.
    if (!this._client) {
      throw new Error(
        "Cannot access NATS client before client is connected to NATS."
      );
    }

    // If the client is already connected, return client as the return value of get function.
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      // On Successful connection to client
      this.client.on("connect", () => {
        console.log(`Successfully Connected Client Id: ${clientId} to NATS Cluster: ${clusterId} !!!!!`);
        resolve();
      });

      // On Error connecting to client
      this.client.on("error", (err) => {
        console.error(`FAILED to Connect Client Id: ${clientId} to NATS Cluster: ${clusterId} !!!!!`, err);
        reject(err);
      });
    });
  }
}

export const natsClient = new NatsClient();
