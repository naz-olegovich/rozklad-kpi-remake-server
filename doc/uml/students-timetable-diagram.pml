@startuml
User -> System: Taps on input field
User -> System: Starts entering group name
System -> User: Offers dropdown list with suggestions of group names
User -> System: Entesr a full group name or chooses a name from the dropdown list
User -> System: Taps on "Schedule" button
System -> System: Checks for matches in database
System -> User: Schedule for requested group
@enduml
