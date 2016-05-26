defmodule Chatrooms.Api.UserView do
  use Chatrooms.Web, :view
  alias Chatrooms.User

  def render("user.json", %{token: token, user: user}) do
    %{id: user.id, username: user.username, token: token}
  end
  #On new message from the socket channel we will render the username only.
  #This is why we need this extra function
  def render("usersocket.json", %{user: user}) do
    %{username: user.username}
  end

  def render("edit.json", %{user: user}) do
    %{email: user.email, username: user.username}
  end

  def render("update.json", %{user: user}) do
    %{id: user.id, username: user.username, flash: "Account has been updated successfully"}
  end

  def render("update_password.json", %{user: user}) do
    %{flash: "Password has been updated successfully"}
  end
end
