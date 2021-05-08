@startuml
Registered_User -> System : Presses "Login" button
System -> Registered_User: Provides a login form
Registered_User -> System : Fills in required data
Registered_User -> System : Presses "Login"
System -> System : Checks entered data
System -> Registered_User: Login user under a specific account
@enduml
