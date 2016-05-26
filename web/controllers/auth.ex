#This is a module Plug
#Module Plugs provides two functions with some configuration details.
#A typical Plug transofrms a collection

#NOTICE - This file can also server the regular website that does HTTP request.
#FOr our React API clent we only use the following functions:
# "login_by_email_and_pass_api" -> When user try to login.
# "validate_password" -> when user tries to update his password we will first validate his current one. Being called from session controller
# "verify_token_and_set_user" -> Verifies users token and set the user to the assign so we can easily fetch it from the controller

defmodule Chatrooms.Auth do
  import Plug.Conn
  import Phoenix.Controller
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0] #Library that helps with validating/hashing passwords.

  @max_age 2 * 7 * 24 * 60 * 60 # 14 days
  defp put_current_user(conn, user) do
    token = Phoenix.Token.sign(conn, "user socket", user.id)

    Phoenix.Token.verify(conn, "user socket", token, max_age: @max_age)

    conn
    |> assign(:current_user, user)
    |> assign(:user_token, token)
  end

  #Serves API login request
  def login_by_email_and_pass_api(conn, email, given_pass, opts) do
    repo = Keyword.fetch!(opts, :repo)
    user = repo.get_by(Chatrooms.User, email: email)

    cond do
      user && checkpw(given_pass, user.password_hash) ->
        {:ok, user, conn}
      user ->
        {:error, :unauthorized, conn}
      true ->
        #Fake check if there is no user so it will return "not found"
        dummy_checkpw()
        {:error, :not_found, conn}
    end
  end

  #validate_password on request to update password
  def validate_password(conn, user, given_pass) do
    cond do
      user && checkpw(given_pass, user.password_hash) ->
        {:ok, user, conn}
      user ->
        {:error, :unauthorized, conn}
      true ->
        #Fake check if there is no user so it will return "not found"
        dummy_checkpw()
        {:error, :not_found, conn}
    end
  end

  #If token is older than 14 days then verification would fail with reason-expired.
  @max_age 2 * 7 * 24 * 60 * 60 # 14 days

  def verify_token_and_set_user(conn, _opts) do
    token = conn.params["token"]
    #Returns status :ok and the users ID on successful token verification
    case Phoenix.Token.verify(conn, "user", token, max_age: @max_age) do
      {:ok, user_id} ->
        cond do
          user = Chatrooms.Repo.get(Chatrooms.User, user_id) ->
            conn
            |> assign(:current_user, user)
          true ->
            conn
            |> put_status(:not_found)
            |> text("User not found")
            |> halt() #We want to stop everything on error. Otherwise it will continue to the action which is bad.
        end
      {:error, _reason} ->
        conn
        |> put_status(:not_acceptable)
        |> text("token failed verification")
        |> halt() #We want to stop everything on error. Otherwise it will continue to the action which is bad.
    end
  end
end
