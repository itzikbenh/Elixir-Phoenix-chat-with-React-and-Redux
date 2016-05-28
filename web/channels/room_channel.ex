defmodule Chatrooms.RoomChannel do
  use Chatrooms.Web, :channel
  alias Chatrooms.Presence
  alias Chatrooms.Api.MessageView

  def join("rooms:" <> room_name, _params, socket) do
    room = Repo.get_by!(Chatrooms.Room, name: room_name)

    #Loads messages that relate to this specific room.
    messages = Repo.all(
      from a in assoc(room, :messages), #we must be explicit and mention that we want the messages that belongs to the room
        order_by: [asc: a.inserted_at],
        limit: 200,
        preload: [:user] #loads the user that is associated with each message
    )
    #
    resp = %{messages: Phoenix.View.render_many(messages, MessageView, "message.json")}
    send self(), :after_join
    {:ok, resp, assign(socket, :room_id, room.id)} #here we assign the room ID to the socket assign so we can use it later
  end

  def handle_info(:after_join, socket) do
    user = Chatrooms.Repo.get(Chatrooms.User, socket.assigns.user_id)
    Presence.track(socket, to_string(socket.assigns.user_id), %{
      device: "browser",
      online_at: inspect(:os.timestamp()),
      username: user.username
    })
    push socket, "presence_state", Presence.list(socket)
    {:noreply, socket}
  end

  def handle_in("new_msg", params, socket) do
    user = Chatrooms.Repo.get(Chatrooms.User, socket.assigns.user_id)

    changeset =
      user
      |> build_assoc(:messages, room_id: socket.assigns.room_id) #equivalent to %Message{user_id: user.id, room_id: socket.assigns.room_id}
      |> Chatrooms.Message.changeset(params)

    case Repo.insert(changeset) do
      {:ok, message} ->
        broadcast! socket, "new_msg", %{
          user: Chatrooms.Api.UserView.render("usersocket.json", %{user: user}),
          body: message.body,
        }
        {:reply, :ok, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

end
