defmodule Chatrooms.Api.SessionController do
  use Chatrooms.Web, :controller


  def create(conn, %{"session" => %{"email" => email, "password" => pass}}) do

    case Chatrooms.Auth.login_by_email_and_pass_api(conn, String.downcase(email), pass, repo: Repo) do
      {:ok, user, conn} ->
        conn
        |> put_status(:ok)
        |> render(Chatrooms.Api.UserView, "user.json", %{token: Phoenix.Token.sign(conn, "user", user.id), user: user})
      {:error, _reason, conn} ->
        conn
        |> put_status(:not_found)
        |> text("Invalid email/password combination")
    end
  end
end



app_dir = "/etc/nginx/phoenix_app/chatrooms/rel/chatrooms/bin/chatrooms" <> "/priv/repo/migrations"
