defmodule Chatrooms.PageController do
  use Chatrooms.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
