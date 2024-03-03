class ConnectionManager {
  constructor() {
    this.connections = [];
  }

  addConnection(connection) {
    this.connections.push(connection);
  }

  removeConnection(connection) {
    this.connections = this.connections.filter((c) => c !== connection);
  }

  broadcast(data) {
    this.connections.forEach((c) => c.send(data));
  }
}
module.exports = ConnectionManager;
