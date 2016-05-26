defmodule Chatrooms.Router do
  use Chatrooms.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Chatrooms do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api", Chatrooms.Api do
    pipe_through :api

    resources "/rooms", RoomController, except: [:new, :edit, :show], param: "token"
    resources "/users", UserController, except: [:index, :show, :new], param: "token"
    get "/verifytoken/:token", UserController, :verify_token
    patch "/users/updatepassword/:token", UserController, :update_password
    resources "/sessions", SessionController, only: [:create]
  end
end
