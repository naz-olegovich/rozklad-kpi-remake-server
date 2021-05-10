@startuml
Registered_User -> System : Presses "Create event" button
System -> Registered_User: Provides a form
Registered_User -> System : Fills in required data
Registered_User -> System : Presses "Create"
System -> System : Checks entered data
System -> Registered_User: Creates a new events
@enduml
