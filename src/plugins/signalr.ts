import { HubConnectionBuilder, HubConnectionState, type HubConnection } from '@microsoft/signalr'

const connection: HubConnection = new HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5223'}/hubs/notifications`, {
    withCredentials: true,
  })
  .withAutomaticReconnect()
  .build()

export const startNotificationConnection = async () => {
  if (
    connection.state === HubConnectionState.Disconnected
  ) {
    await connection.start()
  }
}

export const stopNotificationConnection = async () => {
  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop()
  }
}

export default connection
