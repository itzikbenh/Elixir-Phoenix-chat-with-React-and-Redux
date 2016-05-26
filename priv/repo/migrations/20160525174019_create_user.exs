defmodule Chatrooms.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string, null: false
      add :email, :string, null: false
      add :password_hash, :string

      timestamps
    end
    create unique_index(:users, [:email])
    create unique_index(:users, ["lower(username)"], name: :users_username_index)
  end
end
