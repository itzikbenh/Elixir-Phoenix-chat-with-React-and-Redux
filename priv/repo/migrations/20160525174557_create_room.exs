defmodule Chatrooms.Repo.Migrations.CreateRoom do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :name, :string
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps
    end
    create index(:rooms, [:user_id])
    create unique_index(:rooms, ["lower(name)"], name: :rooms_name_index)
  end
end
