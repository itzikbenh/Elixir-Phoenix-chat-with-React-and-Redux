defmodule Chatrooms.Api.RoomController do
  use Chatrooms.Web, :controller
  #This plug is set at "auth.ex" file. We made it availabe through the "web.ex" file.
  plug :verify_token_and_set_user when action in [:create, :delete]

  alias Chatrooms.Room
  #Will turn empty strings into nil so it will raise an error in case they are required.
  plug :scrub_params, "room" when action in [:create, :update]
  #NOTICE - all the views that we render here are expected to be in the format of:
  #"Chatrooms.Api.RoomView", except those we specified to be different. E.G. "Chatrooms.ChangesetView".
  #These are all JSON view so they just render the data so it can be sent to the client
  #there is not real htmk view rendered here since this controller only serves the API client.
  def index(conn, _params) do
    rooms = Repo.all(Room)
    render(conn, "index.json", rooms: rooms)
  end

  def create(conn, %{"token" => token, "room" => room_params}) do
    #changeset = Room.changeset(%Room{}, room_params)
    user = conn.assigns[:current_user]
    changeset =
      user
      |> build_assoc(:rooms)
      |> Room.changeset(room_params)

    case Repo.insert(changeset) do
      {:ok, room} ->
        conn
        |> put_status(:created)
        |> render("show.json", room: room)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Chatrooms.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "room" => room_params}) do
    room = Repo.get!(Room, id)
    changeset = Room.changeset(room, room_params)

    case Repo.update(changeset) do
      {:ok, room} ->
        render(conn, "show.json", room: room)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Chatrooms.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"token" => token, "room" => room_params}) do
    room = Repo.get_by!(Room, name: room_params["name"])

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(room)

    send_resp(conn, :no_content, "")
  end
end
