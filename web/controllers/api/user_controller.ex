defmodule Chatrooms.Api.UserController do
  use Chatrooms.Web, :controller
  plug :verify_token_and_set_user when action in [:edit, :update, :update_password, :delete]

  alias Chatrooms.User

  #NOTICE - all the views that we render here are expected to be in the format of:
  #"Chatrooms.Api.UserView", except those we specified to be different. E.G. "Chatrooms.ChangesetView".
  #These are all JSON view so they just render the data so it can be sent to the client
  #there is not real htmk view rendered here since this controller only serves the API client.

  #This is how the parameters might look like
  #"user" => %{"name" => "Johnny", "password" => "[FILTERED]", "username" => "JohnnyCage"}}
  def create(conn, %{"user" => user_params}) do
    changeset = User.registration_changeset(%User{}, user_params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> render("user.json", %{token: Phoenix.Token.sign(conn, "user", user.id), user: user})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Chatrooms.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def edit(conn, %{"token" => token}) do
    user = conn.assigns[:current_user]

    conn
    |> put_status(:ok)
    |> render("edit.json", %{user: user})
  end

  def update(conn, %{"token" => token, "user" => user_params}) do
    user = conn.assigns[:current_user]
    changeset = User.changeset(user, user_params)

    case Repo.update(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> render("update.json", %{user: user})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Chatrooms.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update_password(conn, %{"token" => token, "user" => user_params}) do
    user = conn.assigns[:current_user]
    pass = user_params["currentPassword"]
    #If it's a Facebbok user he has no password and we want to catch it before we send it
    #to be validated through Comeonin.
    case user.password_hash do
      nil ->
        conn
        |> put_status(:not_found)
        |> text("invalid password")
      _ ->
        case Chatrooms.Auth.validate_password(conn, user, pass) do
          {:ok, user, conn} ->
            changeset = User.update_password_changeset(user, user_params)

            case Repo.update(changeset) do
              {:ok, user} ->
                conn
                |> put_status(:ok)
                |> render("update_password.json", %{user: user})
              {:error, changeset} ->
                conn
                |> put_status(:unprocessable_entity)
                |> render(Chatrooms.ChangesetView, "error.json", changeset: changeset)
            end
          {:error, _reason, conn} ->
            conn
            |> put_status(:not_found)
            |> text("invalid password")
        end
    end
  end
  #This function is not used, but I'm leaving it just in case you want to implement it.
  def delete(conn, %{"token" => token}) do
    user = conn.assigns[:current_user]
    #bang will raise an error incase of a problem
    Repo.delete!(user)
    conn
    |> put_status(:ok)
    |> text("You have successfully deleted your account.")
  end

  #If token is older than 14 days then verification would fail with reason-expired.
  @max_age 2 * 7 * 24 * 60 * 60 # 14 days

  def verify_token(conn, %{"token" => token}) do
    #Returns status :ok and the users ID on successful token verification
    case Phoenix.Token.verify(conn, "user", token, max_age: @max_age) do
      {:ok, user_id} ->
        #Checks if user exists after token is verified successfully
        cond do
          user = Repo.get(User, user_id) ->
            conn
            |> put_status(:ok)
            |> render("user.json", %{token: token, user: user})
          #If user not found then the condition will default to this
          true ->
            conn
            |> put_status(:not_found)
            |> text("User not found")
        end
      {:error, _reason} ->
        conn
        |> put_status(:not_acceptable)
        |> text("token failed verification")
    end
  end
end
