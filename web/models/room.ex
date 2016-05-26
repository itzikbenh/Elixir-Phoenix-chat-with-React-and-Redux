defmodule Chatrooms.Room do
  use Chatrooms.Web, :model

  schema "rooms" do
    field :name, :string
    belongs_to :user, Chatrooms.User
    has_many :messages, Chatrooms.Message

    timestamps
  end

  @required_fields ~w(name)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> update_change(:name, &String.downcase/1) #downcase name before insert
    |> unique_constraint(:name)
  end
end
