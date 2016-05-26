defmodule Chatrooms.Api.MessageView do
  use Chatrooms.Web, :view

  def render("message.json", %{message: msg}) do
    %{
      body: msg.body,
      user: msg.user.username
    }
  end
end
