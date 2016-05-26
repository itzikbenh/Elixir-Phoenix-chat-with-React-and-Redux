defmodule Chatrooms.Repo.Migrations.CreateMessage do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :body, :text
      add :user_id, references(:users, on_delete: :delete_all)
      add :room_id, references(:rooms, on_delete: :delete_all)

      timestamps
    end
    create index(:messages, [:user_id])
    create index(:messages, [:room_id])

  end
end
