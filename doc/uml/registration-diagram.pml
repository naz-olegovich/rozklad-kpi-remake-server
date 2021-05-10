@startuml
Unregistered_User -> System : Presses "Register" button
System -> Unregistered_User: Provides a form for registaration
Unregistered_User -> System : Fills in required data
Unregistered_User -> System : Presses "Register"
System -> System : Checks entered data
System -> System : Adds a new user to database
@enduml
