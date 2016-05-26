defmodule Chatrooms.User do
  use Chatrooms.Web, :model

  schema "users" do
    field :username, :string
    field :email, :string
    field :password, :string, virtual: true #Intermediate field before hashing the password. won't be persisted
    field :password_confirmation, :string, virtual: true #Intermediate field for confirming password
    field :password_hash, :string
    has_many :rooms, Chatrooms.Room
    has_many :messages, Chatrooms.Message

    timestamps
  end

  @required_fields ~w(username email)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_length(:username, min: 3, max: 20, message: "should be at least 3 characters")
    |> validate_length(:email, min: 3, max: 40, message: "should be at least 3 characters")
    |> update_change(:email, &String.downcase/1) #downcase email before insert
    |> validate_format(:email, ~r/\A[\w+\-.]+@[a-z\-.]+\.[a-z]+\z/i)
    |> unique_constraint(:email) #If not unique returns an error after fail DB insert
    |> unique_constraint(:username) #If not unique returns an error after fail DB insert
  end

  def registration_changeset(model, params) do
    model
    |> changeset(params)
    |> cast(params, ~w(password), [])
    |> validate_length(:password, min: 6, max: 100, message: "should be at least 6 characters")
    |> validate_confirmation(:password, message: "do not match")
    |> put_pass_hash()
  end

  def update_password_changeset(model, params \\ :empty) do
    model
    |> cast(params, ~w(password), [])
    |> validate_length(:password, min: 6, max: 100, message: "should be at least 6 characters")
    |> validate_confirmation(:password, message: "do not match")
    |> put_pass_hash()
  end

  defp put_pass_hash(changeset) do
    case changeset do
      #It will try to pattern match the changeset.
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(pass))
      _ ->
        changeset
    end
  end
end
