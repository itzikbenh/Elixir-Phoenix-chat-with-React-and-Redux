defmodule Chatrooms.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "rooms:*", Chatrooms.RoomChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket

  @max_age 2 * 7 * 24 * 60 * 60
  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, "user", token, max_age: @max_age) do
      {:ok, user_id} ->
        {:ok, assign(socket, :user_id, user_id)}
      {:error, _reason} ->
        :error
    end
  end

  #If something went wrong this function would return an error.
  def connect(_params, _socket), do: :error

  def id(socket), do: "users_socket:#{socket.assigns.user_id}"
end
