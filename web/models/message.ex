defmodule Chatrooms.Message do
  use Chatrooms.Web, :model

  schema "messages" do
    field :body, :string
    belongs_to :user, Chatrooms.User
    belongs_to :room, Chatrooms.Room

    timestamps
  end

  @required_fields ~w(body)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
