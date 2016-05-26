ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Chatrooms.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Chatrooms.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Chatrooms.Repo)

