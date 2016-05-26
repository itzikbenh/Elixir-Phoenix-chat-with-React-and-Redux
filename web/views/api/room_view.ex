defmodule Chatrooms.Api.RoomView do
  use Chatrooms.Web, :view

  def render("index.json", %{rooms: rooms}) do
    %{rooms: render_many(rooms, Chatrooms.Api.RoomView, "room.json")}
  end

  def render("show.json", %{room: room}) do
    %{room: render_one(room, Chatrooms.Api.RoomView, "room.json")}
  end

  def render("room.json", %{room: room}) do
    %{name: room.name,
      user_id: room.user_id}
  end
end
